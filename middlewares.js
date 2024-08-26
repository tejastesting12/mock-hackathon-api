const jsonServer = require('json-server');
const db = require('./db.json');

module.exports = (req, res, next) => {
    if (req.method === 'GET') {
        const { start, end, platform, riskMode } = req.query;

        const resource = req.path.substring(1);
        const data = db[resource];

        if (!data) {
            return res.status(404).json({ error: 'Resource not found' });
        }

        let filteredData = data;

        // Filter by date range if start and end are provided
        if (start && end) {
            const startDate = new Date(start);
            const endDate = new Date(end);

            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                return res.status(400).json({ error: 'Invalid date format' });
            }

            filteredData = filteredData.filter(item => {
                const itemDate = new Date(item.date);
                return itemDate >= startDate && itemDate <= endDate;
            });
        }

        // Filter by platform if platform is provided
        if (platform) {
            filteredData = filteredData.filter(item => {
                // Check if 'contribution' exists and filter by platform
                const contribution = item.contribution;
                if (contribution) {
                    return Object.keys(contribution).some(key => key.startsWith(platform));
                }
                return false;
            });
        }
		if (riskMode) {
			filteredData = filteredData.filter(item=>item.riskMode.toLowerCase()==riskMode.toLowerCase())
		}

        res.json(filteredData);
    } else {
        // If no query parameters are present, continue to the default router
        next();
    }
};
