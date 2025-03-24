const supabase = require("../config/db");

exports.getAllCategories = async (req, res) => {
  try {
    const { data: categories, error } = await supabase
      .from("categories")
      .select("*");
    if (error)
      return res
        .status(500)
        .render("error", { message: "Error fetching categories" });
    res.render("categories", { categories });
  } catch (err) {
    res
      .status(500)
      .render("error", { message: "An unexpected error occurred" });
  }
};

exports.renderAddCategoryForm = (req, res) => {
  res.render("new_category");
};

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const { error } = await supabase.from("categories").insert([{ name }]);
    if (error)
      return res
        .status(500)
        .render("error", { message: "Error adding category" });
    res.redirect("/categories");
  } catch (err) {
    res
      .status(500)
      .render("error", { message: "An unexpected error occurred" });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data: category, error: categoryError } = await supabase
      .from("categories")
      .select("*")
      .eq("id", id)
      .single();

    if (categoryError || !category) {
      return res.status(404).render("error", { message: "Category not found" });
    }

    const { data: items, error: itemsError } = await supabase
      .from("items")
      .select("*")
      .eq("category_id", id);

    if (itemsError)
      return res
        .status(500)
        .render("error", { message: "Error fetching items" });

    res.render("category", { category, items });
  } catch (err) {
    res
      .status(500)
      .render("error", { message: "An unexpected error occurred" });
  }
};

exports.renderEditCategoryForm = async (req, res) => {
  try {
    const { id } = req.params;
    const { data: category, error } = await supabase
      .from("categories")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !category) {
      return res.status(404).render("error", { message: "Category not found" });
    }

    res.render("edit_category", { category });
  } catch (err) {
    res
      .status(500)
      .render("error", { message: "An unexpected error occurred" });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const { error } = await supabase
      .from("categories")
      .update({ name })
      .eq("id", id);

    if (error)
      return res
        .status(500)
        .render("error", { message: "Error updating category" });

    res.redirect("/categories");
  } catch (err) {
    res
      .status(500)
      .render("error", { message: "An unexpected error occurred" });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if any items exist under this category
    const { data: items, error: itemsError } = await supabase
      .from("items")
      .select("id")
      .eq("category_id", id);

    if (itemsError) {
      return res
        .status(500)
        .render("error", { message: "Error checking category dependencies" });
    }

    if (items.length > 0) {
      return res.status(400).render("error", {
        message: "Cannot delete category as it has associated items",
      });
    }

    // Proceed with deletion if no items are linked
    const { error } = await supabase.from("categories").delete().eq("id", id);

    if (error) {
      return res
        .status(500)
        .render("error", { message: "Error deleting category" });
    }

    res.redirect("/categories");
  } catch (err) {
    res
      .status(500)
      .render("error", { message: "An unexpected error occurred" });
  }
};
