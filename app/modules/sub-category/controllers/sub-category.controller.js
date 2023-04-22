const express = require("express");
const mongoose = require("mongoose");
const routeLabel = require("route-label");
const router = express.Router();
const namedRouter = routeLabel(router);
const categoryRepo = require("category/repositories/category.repository");
const subategoryRepo = require("sub-category/repositories/sub-category.repository");

class subcategoryController {
  constructor() { }

  /* @Method: list
  // @Description: View for all the category from DB
  */
  async list(req, res) {
    try {
      res.render("sub-category/views/list.ejs", {
        page_name: "sub-category",
        page_title: "SUB-CATEGORY List",
        user: req.user
      });
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
       
      res.render("sub-category/views/add.ejs", {
        page_name: "sub-category",
        page_title: "Sub-Category Create",
        response: categorydata,
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


        let savedata = await subategoryRepo.save(req.body);
        req.flash("success", "sub category added successfully.");
        res.redirect(namedRouter.urlFor("sub-category.list"));
  
    } catch (e) {      
      req.flash("error", e.message);
      console.log(e.message);
      res.redirect(namedRouter.urlFor("sub-category.create"));
    }
  };

  /* @Method: update
  // @Description: category update action
  */
  async update(req, res) {
    try {
 
      const subcategoryId = req.body.id;
      let checkdata = await subategoryRepo.getByField({category:req.body.categorytype,subcategory:req.body.subcategory,isDeleted:false,
      
        _id:{
          $ne: subcategoryId
        }
      
      });

      if(_.isEmpty(checkdata)) {

        let subcategoryUpdate = await subategoryRepo.updateById(subcategoryId, req.body);
        if (subcategoryUpdate) {
          req.flash("success", "sub category Updated Successfully");
          res.redirect(namedRouter.urlFor("sub-category.list"));
        } else {
          const subcategoryId = req.body.id;
          res.redirect(
            namedRouter.urlFor("sub-category.edit", {
              id: subcategoryId
            })
          );
        }
      } else {
        req.flash("error",'sub category is already exists');
        res.redirect(namedRouter.urlFor("sub-category.create"));
      }
         


    } catch (e) {
      req.flash("error", e.message);
      res.redirect(namedRouter.urlFor("sub-category.edit", {
        id: subcategoryId
      }));
    }
  };

  /* @Method: getAll
  // @Description: To get all the category from DB
  */
  async getAll(req, res) {
    try {
      let subcategoryData = await subategoryRepo.getAll(req);
      if (_.has(req.body, "sort")) {
        var sortOrder = req.body.sort.sort;
        var sortField = req.body.sort.field;
      } else {
        var sortOrder = -1;
        var sortField = "_id";
      }
      let meta = {
        page: req.body.pagination.page,
        pages: subcategoryData.pages,
        perpage: req.body.pagination.perpage,
        total: subcategoryData.total,
        sort: sortOrder,
        field: sortField,
      };

      return {
        status: 200,
        meta: meta,
        data: subcategoryData.docs,
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
      
      let mtInfo = await subategoryRepo.getById(req.params.id);
     
      let categorydata = await categoryRepo.getAllByField({status:'Active',isDeleted:false});
     
      if (!_.isEmpty(mtInfo)) {
        res.render("sub-category/views/edit.ejs", {
          page_name: "sub-category",
          page_title: "SubCategory Edit",
          user: req.user,
          response: mtInfo,
          data:categorydata
        });
      } 
      //  else if(!_.isEmpty(data)) {
      //    res.render("sub-category/views/edit.ejs", {
      //      page_name: "sub-category",
      //      page_title: "SubCategory Edit",
      //      user: req.user,
      //      res: data
      //    });
      //  }
      else {
        req.flash("error", "Sorry, record not found!");
        res.redirect(namedRouter.urlFor("sub-category.list"));
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

      let mtDelete = await subategoryRepo.updateById(req.params.id, {
        isDeleted: true,
      });
      req.flash("success", "Sub Category removed successfully");
      res.redirect(namedRouter.urlFor("sub-category.list"));

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


      let subcategoryInfo = await subategoryRepo.getById(req.params.id);

      if (!_.isEmpty(subcategoryInfo)) {
        let subcategoryStatus =
          subcategoryInfo.status == "Active" ? "Inactive" : "Active";
        let subcategoryUpdate = subategoryRepo.updateById(req.params.id, {
          status: subcategoryStatus,
        });

        req.flash("success", "sub category status has changed successfully");
        res.redirect(namedRouter.urlFor("sub-category.list"));
      }

    } catch (e) {
      return res.status(500).send({
        message: e.message,
      });
    }
  };

};

module.exports = new subcategoryController();