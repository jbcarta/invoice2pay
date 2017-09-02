// Ejemplo de busqueda relaccional

db.getCollection('approvalscheme').aggregate([
    {$match : {costcenter : 'BLOO9000'}},
    {$lookup: {from: "aprovallevels",localField: "aplevel",foreignField: "aplevel",as: "aplevels"}},
    {$project : {
            posts : { $filter : {input : "$aplevels"  , as : "post", 
            	cond : { $and: { $gte: [ "$$valmin", 0 ] }, { $lte: [ "$$valmax", 1 ] }} }},
            costcenter : 'BLOO9000'
        }}

])



db.approvallevels.find(
	{$and: { $gte: [ "valmin", 0 ] }, 
	       { $lte: [ "valmax", 1000] }
	   } ).pretty()

db.approvallevels.find(
	{$gt: [ "valmin", 0 ] }
	   ).pretty()

db.approvallevels.find(
	{$and: [ {valmin : {$lte: 100 } }, {valmax : {$gte: 100 }}, {currency : {$eq: "ARS"}} ]
	   }).pretty()


db.approvalscheme.find(
	{$and: [ {costcenter : {$eq: 'BLOO9000' } }, {aplevel : {$eq: 'L1'}} ]}).pretty()          

db.approvalscheme.find(
	{costcenter: {"$regex": /BLOO9000/}}).pretty()

db.approvalschemes.find(
	{$and: [ {costcenter: {"$regex": /BLOO9000/}}, {aplevel : {$eq: 'L1'}} ]}).pretty()