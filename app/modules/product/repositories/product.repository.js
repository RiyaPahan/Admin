const mongoose = require('mongoose');
const productInfo = require('product/models/product.model.js');
const categoryInfo =  require('category/models/category.model.js');
const subcategoryInfo = require('sub-category/models/sub-category.model.js');
const perPage = config.PAGINATION_PERPAGE;

const productRepository = {

    getAll: async (req) => {
        try {
            var conditions = {};
            var and_clauses = [];
            and_clauses.push({
                "isDeleted": false
            });

            

            //  console.log(req.body.query);
            // console.log(req.body.query.generalSearch);

            if (_.isObject(req.body.query) && _.has(req.body.query, 'generalSearch')) {
                and_clauses.push({
                    $or: [
                        { 'category.category': { $regex: req.body.query.generalSearch, $options: 'i' } },
                        {'subcategory.subcategory': { $regex: req.body.query.generalSearch, $options: 'i' } },
                        {'product': { $regex: req.body.query.generalSearch, $options: 'i' } }
                    ]
                });
            }
            if (_.isObject(req.body.query) && _.has(req.body.query, 'Status')) {
                and_clauses.push({
                    "status": req.body.query.Status
                });
            }
            conditions['$and'] = and_clauses;

            var sortOperator = {
                "$sort": {}
            };
           
            if (_.has(req.body, 'sort')) {
                var sortField = req.body.sort.field;

     //console.log('sort ',req.body.sort); //sort  { field: 'question', sort: 'asc' }
                if (req.body.sort.sort == 'desc') {
                    var sortOrder = -1;
                } else if (req.body.sort.sort == 'asc') {
                    var sortOrder = 1;
                }

           // {'$sort':{'question':-1}}

                sortOperator["$sort"][sortField] = sortOrder;
            } else {
                sortOperator["$sort"]['_id'] = -1;
            }



            var aggregate = productInfo.aggregate([

                {
 
                 $lookup:{
 
                     from:'subcategorymodels',
                     let:{
                         subcategoryId:'$subcategory'
                     },
                     pipeline:[
                         {
                             $match:{
                                 $expr:{
                                     $and:[
                                         {
                                             $eq:['$_id','$$subcategoryId']
                                         }
                                     ]
                                 }
                             }
                         }
                     ],
 
                     as:'subcategory'
 
                 }
 
                },
                {
 
                 $lookup:{
 
                     from:'categorymodels',
                     let:{
                         categoryId:'$category'
                     },
                     pipeline:[
                         {
                             $match:{
                                 $expr:{
                                     $and:[
                                         {
                                             $eq:['$_id','$$categoryId']
                                         }
                                     ]
                                 }
                             }
                         }
                     ],
 
                     as:'category'
 
                 }
 
                },
                 {
                      $project: {
                          _id: "$_id",
                          category: "$category",
                          subcategory:"$subcategory",
                          product:'$product',
                          image:'$image',
                          status: "$status",
                          createdAt:'$createdAt',
                          isDeleted: "$isDeleted"
                      }
                  },
                  {
                     $unwind:{
                       path:'$subcategory'
                     }
                   },
                   {
                     $unwind:{
                       path:'$category'
                     }
                   },
 
                 {
                     $match: conditions
                 },
 
                 sortOperator
 
             ]);
  

            var options = {
                page: req.body.pagination.page,
                limit: req.body.pagination.perpage
            };
            let allRecord = await productInfo.aggregatePaginate(aggregate, options);

            return allRecord;
        } catch (e) {
            throw (e);
        }
    },


    getById: async (id) => {

        try {
            let record = await productInfo.findById(id).lean().exec();

            if (!record) {
                return null;
            }
            return record;

        } catch (e) {
            throw e;
        }
    },

    getByField: async (params) => {

        try {
            let record = await productInfo.findOne(params).exec();

            if (!record) {
                return null;
            }
            return record;

        } catch (e) {
            throw e;
        }
    },

    getAllByField: async (params) => {

        try {
            let record = await productInfo.find(params).sort({
                'name': 1
            }).exec();

            if (!record) {
                return null;
            }
            return record;

        } catch (e) {
            throw e;
        }
    },



    save: async (data) => {
        try {
            let save = await productInfo.create(data);
            if (!save) {
                return null;
            }
            return save;
        } catch (e) {
            throw e;
        }
    },

    getDocumentCount: async (params) => {
        try {
            let recordCount = await productInfo.countDocuments(params);
            if (!recordCount) {
                return 0;
            }
            return recordCount;
        } catch (e) {
            throw e;
        }
    },

    delete: async (id) => {
        try {
            let record = await productInfo.findById(id);
            if (record) {
                let recordDelete = await productInfo.findByIdAndUpdate(id, {
                    isDeleted: true
                }, {
                    new: true
                });
                if (!recordDelete) {
                    return null;
                }
                return recordDelete;
            }
        } catch (e) {
            throw e;
        }
    },

    updateById: async (id, data) => {
        try {
            let record = await productInfo.findByIdAndUpdate(id, data, {
                new: true
            });
            if (!record) {
                return null;
            }
            return record;
        } catch (e) {
            throw e;
        }
    },

    updateByField: async (field, fieldValue, data) => {
        //todo: update by field
    }
};

module.exports = productRepository;