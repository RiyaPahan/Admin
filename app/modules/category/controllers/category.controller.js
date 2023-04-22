const express = require("express");
const mongoose = require("mongoose");
const routeLabel = require("route-label");
const router = express.Router();
const namedRouter = routeLabel(router);
const categoryRepo = require("category/repositories/category.repository");

class categoryController {
  constructor() { }

  /* @Method: list
  // @Description: View for all the category from DB
  */
  async list(req, res) {
    try {
      res.render("category/views/list.ejs", {
        page_name: "category-management",
        page_title: "CATEGORY List",
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
      
      res.render("category/views/add.ejs", {
        page_name: "category-management",
        page_title: "Category Create",
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

      //console.log(collection.find({}));

    let checkdata = await categoryRepo.getByField({'category':req.body.category,isDeleted:false});

      if(_.isEmpty(checkdata)) {

        let savecategory = await categoryRepo.save(req.body);
        req.flash("success", "category added successfully.");
        res.redirect(namedRouter.urlFor("category.list"));
  
      } else {

        req.flash("error",'category is already exists');
        res.redirect(namedRouter.urlFor("category.create"));
      }
    } catch (e) {      
      req.flash("error", e.message);
      res.redirect(namedRouter.urlFor("category.create"));
    }
  };

  /* @Method: update
  // @Description: category update action
  */
  async update(req, res) {
    try {
 
      const categoryId = req.body.id;
      
      let checkdata = await categoryRepo.getByField({'category':req.body.category,isDeleted:false});

      if(_.isEmpty(checkdata)) {

        let categoryUpdate = await categoryRepo.updateById(categoryId, req.body);
        if (categoryUpdate) {
          req.flash("success", "category Updated Successfully");
          res.redirect(namedRouter.urlFor("category.list"));
        } else {
          res.redirect(
            namedRouter.urlFor("category.edit", {
              id: categoryId
            })
          );
        }

      } else {
        req.flash("error", 'category already exists');
        res.redirect(namedRouter.urlFor("category.create"));
      }

    } catch (e) {
      req.flash("error", e.message);
      res.redirect(namedRouter.urlFor("category.edit", {
        id: categoryId
      }));
    }
  };
  /* @Method: getAll
  // @Description: To get all the category from DB
  */
  async getAll(req, res) {
    try {
      let categoryData = await categoryRepo.getAll(req);
      if (_.has(req.body, "sort")) {
        var sortOrder = req.body.sort.sort;
        var sortField = req.body.sort.field;
      } else {
        var sortOrder = -1;
        var sortField = "_id";
      }
      let meta = {
        page: req.body.pagination.page,
        pages: categoryData.pages,
        perpage: req.body.pagination.perpage,
        total: categoryData.total,
        sort: sortOrder,
        field: sortField,
      };

      return {
        status: 200,
        meta: meta,
        data: categoryData.docs,
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
      
      let mtInfo = await categoryRepo.getById(req.params.id);
      if (!_.isEmpty(mtInfo)) {
        res.render("category/views/edit.ejs", {
          page_name: "category-management",
          page_title: "Category Edit",
          user: req.user,
          response: mtInfo
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

      let mtDelete = await categoryRepo.updateById(req.params.id, {
        isDeleted: true,
      });
      req.flash("success", "Category removed successfully");
      res.redirect(namedRouter.urlFor("category.list"));

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


      let categoryInfo = await categoryRepo.getById(req.params.id);

      if (!_.isEmpty(categoryInfo)) {
        let categoryStatus =
          categoryInfo.status == "Active" ? "Inactive" : "Active";
        let categoryUpdate = categoryRepo.updateById(req.params.id, {
          status: categoryStatus,
        });

        req.flash("success", "category status has changed successfully");
        res.redirect(namedRouter.urlFor("category.list"));
      }

    } catch (e) {
      return res.status(500).send({
        message: e.message,
      });
    }
  };

};

module.exports = new categoryController();