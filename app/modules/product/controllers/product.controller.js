const express = require("express");
const mongoose = require("mongoose");
const routeLabel = require("route-label");
const router = express.Router();
const fs = require('fs');
const namedRouter = routeLabel(router);
const productInfo = require('product/models/product.model.js');
const productRepo = require("product/repositories/product.repository");
const categoryRepo = require("category/repositories/category.repository");
const subategoryRepo = require("sub-category/repositories/sub-category.repository");

class productController {
  constructor() { }

  /* @Method: list
  // @Description: View for all the category from DB
  */
  async list(req, res) {
    try {
      res.render("product/views/list.ejs", {
        page_name: "product-management",
        page_title: "PRODUCT List",
        user: req.user
      });
    } catch (e) {
      return res.status(500).send({
        message: e.message
      });
    }
  };

  async sub(req, res) {
    try {

      //console.log(req.query);
      
      let data = await subategoryRepo.getAllByField({category:req.query.id,status:'Active',isDeleted:false});
      
      res.send({
        response: data,
        // info:req.query.mainId
      })

    } catch (e) {
      return res.status(500).send({
        message: e.message
      });
    }
  };

  /*
  // @Method: create
  // @Description:  category create page
  */
  async create(req, res) {
    try {
      
    let categorydata = await categoryRepo.getAllByField({status:'Active',isDeleted:false});
    let subategorydata = await subategoryRepo.getAllByField({status:'Active',isDeleted:false});

        res.render("product/views/add.ejs", {
        page_name: "product-management",
        page_title: "PRODUCT Create",
        response: categorydata,
        result: subategorydata,
        user: req.user        
      });
    } catch (e) {
      return res.status(500).send({
        message: e.message
      });
    }
  };

  /*
  // @Method: insert
  // @Description:  Insert category into DB
  */
  async insert(req, res) {
    try {


    req.files.map((val) => {
      req.body.image = val.filename;
    })  

let checkdata = await productRepo.getByField({category:req.body.category,subcategory:req.body.subcategory,
  product:req.body.product,isDeleted:false});

       if(_.isEmpty(checkdata)) {

         let saveproduct = await productRepo.save(req.body);
         req.flash("success", "product added successfully.");
         res.redirect(namedRouter.urlFor("product.list"));
  
       } else {

         req.flash("error",'product is already exists');
         res.redirect(namedRouter.urlFor("product.create"));
       }
    } catch (e) {      
      req.flash("error", e.message);
      res.redirect(namedRouter.urlFor("product.create"));
    }
  };

  /* @Method: update
  // @Description: product update action
  */
  async update(req, res) {
    try {
 
     
     let mtinfo = await productRepo.getById(req.body.id);

     console.log(mtinfo);
      const productId = req.body.id;

      if(req.files){

        req.files.map((val) => {
          req.body.image = val.filename;
          fs.unlinkSync(`./public/uploads/product/${mtinfo.image}`); //for deleting existing image
        });
      }
      

let checkdata = await productRepo.getByField({category:req.body.category,subcategory:req.body.subcategory,product:req.body.product,
  isDeleted:false,
  _id:{
    $ne: productId 
  }

});

      if(_.isEmpty(checkdata)) {

        let productUpdate = await productRepo.updateById(productId, req.body);
        if (productUpdate) {
          req.flash("success", "product Updated Successfully");
          res.redirect(namedRouter.urlFor("product.list"));
        } else {
          res.redirect(
            namedRouter.urlFor("product.edit", {
              id: productId
            })
          );
        }

      } else {
        req.flash("error", 'product already exists');
        res.redirect(namedRouter.urlFor("product.create"));
      }

    } catch (e) {
      req.flash("error", e.message);
      res.redirect(namedRouter.urlFor("product.edit", {
        id: productId
      }));
    }
  };
  /* @Method: getAll
  // @Description: To get all the category from DB
  */
  async getAll(req, res) {
    try {
      let productData = await productRepo.getAll(req);
      if (_.has(req.body, "sort")) {
        var sortOrder = req.body.sort.sort;
        var sortField = req.body.sort.field;
      } else {
        var sortOrder = -1;
        var sortField = "_id";
      }
      let meta = {
        page: req.body.pagination.page,
        pages: productData.pages,
        perpage: req.body.pagination.perpage,
        total: productData.total,
        sort: sortOrder,
        field: sortField,
      };

      return {
        status: 200,
        meta: meta,
        data: productData.docs,
        message: `Data fetched successfully.`,
      };
    } catch (e) {
      throw e;
    }
  };

  /*
  // @Method: edit
  // @Description:  faq edit page
  */
  async edit(req, res) {
    try {
      
      let mtInfo = await productRepo.getById(req.params.id);
      let categorydata = await categoryRepo.getAllByField({status:'Active',isDeleted:false});
      let subcategorydata = await subategoryRepo.getAllByField({category:mtInfo.category});  

      console.log(subcategorydata);

      if (!_.isEmpty(mtInfo)) {
        res.render("product/views/edit.ejs", {
          page_name: "product-management",
          page_title: "Product Edit",
          user: req.user,
          response: mtInfo,
          result: categorydata,
          subcategory:subcategorydata
        });
      } else {
        req.flash("error", "Sorry, record not found!");
        res.redirect(namedRouter.urlFor("category.list"));
      }
    } catch (e) {
      return res.status(500).send({
        message: e.message
      });
    }
  };

  /* @Method: delete
  // @Description: category delete action
  */
  async delete(req, res) {
    try {

      let mtDelete = await productRepo.updateById(req.params.id, {
        isDeleted: true,
      });
      req.flash("success", "Product removed successfully");
      res.redirect(namedRouter.urlFor("product.list"));

    } catch (e) {
      return res.status(500).send({
        message: e.message,
      });
    }
  };

  /*
  // @Method: statusChange
  // @Description: faq status change action
  */
  async statusChange(req, res) {
    try {


      let productInfo = await productRepo.getById(req.params.id);

      if (!_.isEmpty(productInfo)) {
        let productStatus =
          productInfo.status == "Active" ? "Inactive" : "Active";
        let productUpdate = productRepo.updateById(req.params.id, {
          status: productStatus,
        });

        req.flash("success", "product status has changed successfully");
        res.redirect(namedRouter.urlFor("product.list"));
      }

    } catch (e) {
      return res.status(500).send({
        message: e.message,
      });
    }
  };

};

module.exports = new productController();