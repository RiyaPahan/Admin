const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate');

const status = ['Active', 'Inactive'];

const productSchema = new Schema({
  category: { type: Schema.Types.ObjectId, ref:"categoryModel", default: '' },
  subcategory: { type: Schema.Types.ObjectId, ref:"subcategoryModel", default: ''  },
  product: { type: String, default: ''  },
  image: { type: String, default: ''  },
  status: { type: String, default: 'Active', enum: status },
  isDeleted: { type: Boolean, default: false, enum: [true, false] },
}, 
{ 
    timestamps: true, versionKey: false
 
});



// For pagination
productSchema.plugin(mongooseAggregatePaginate);  

// create the model for Shop and expose it to our app
module.exports = mongoose.model('productModel', productSchema);