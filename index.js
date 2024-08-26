const fs = require('fs')
fs.readFile('db.json', 'utf8', (err, jsonString) => {
	if (err) {
	  console.log("Error reading file:", err);
	  return;
	}
  
	try {
	  const data = JSON.parse(jsonString);
  
	  const contribution = data.reduce((acc, rule) => {
		Object.entries(rule.contribution).forEach(([platform, stats]) => {
		  if (!acc[platform]) {
			acc[platform] = { noOfApproved: 0, noOfRejected: 0, triggerCount: 0, thresholdCount: 0 };
		  }
		  acc[platform].noOfApproved += stats.noOfApproved;
		  acc[platform].noOfRejected += stats.noOfRejected;
		  acc[platform].triggerCount += stats.triggerCount;
		  acc[platform].thresholdCount += stats.thresholdCount;
		});
		return acc;
	  }, {});
	  const sortableContribution = Object.entries(contribution).map(([platform, stats]) => ({
		platform,
		...stats,
		difference: stats.triggerCount - stats.thresholdCount
	  }));
	  sortableContribution.sort((a, b) => b.difference - a.difference);
  
	  const top5 = sortableContribution.slice(0,5);
	  const platforms = top5.map(item=>item.platform.split('|')[0])
	  const triggerCounts = top5.map(item=>item.triggerCount);
	  const thresholdCounts = top5.map(item=>item.thresholdCount);
	  console.log(platforms, triggerCounts, thresholdCounts)

	  const top5Rejections = Object.entries(contribution)
		.map(([platform, stats]) => ({
			platform,
			...stats
		}))
		.sort((a, b) => b.noOfRejected - a.noOfRejected)
		.slice(0, 5);
	  const rejectionPlatforms = top5Rejections.map(item=>item.platform.split('|')[0]);
	  const rejectionCounts = top5Rejections.map(item=>item.noOfRejected)
	  console.log(rejectionPlatforms, rejectionCounts)
	} catch(err) {
	  console.log('Error parsing JSON string:', err);
	}
  });

