const supabase = require("../config/db");

exports.getAllItems = async (req, res) => {
  try {
    const { data: items, error } = await supabase.from("items").select("*");

    if (error) throw error;
    res.render("items", { items });
  } catch (err) {
    res.render("error", { error: err.message });
  }
};

exports.getItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data: item, error: itemError } = await supabase
      .from("items")
      .select("*")
      .eq("id", id)
      .single();

    if (itemError || !item) {
      return res.render("error", { error: "Item not found" });
    }
    const { data: scientist, error: scientistError } = await supabase
      .from("scientists")
      .select("*")
      .eq("id", item.scientist_id)
      .single();

    if (scientistError || !scientist) {
      return res.render("error", { error: "Scientist not found" });
    }

    const { data: category, error: categoryError } = await supabase
      .from("categories")
      .select("*")
      .eq("id", item.category_id)
      .single();

    if (categoryError || !category) {
      return res.render("error", { error: "Category not found" });
    }

    res.render("item", { item, scientist, category });
  } catch (err) {
    res.render("error", { error: "Item not found" });
  }
};

exports.renderAddItemForm = async (req, res) => {
  try {
    const { data: scientists, error: scientistError } = await supabase
      .from("scientists")
      .select("id, name");
    if (scientistError) res.render("error", { error: scientistError.message });

    const { data: categories, error: categoryError } = await supabase
      .from("categories")
      .select("*");

    if (categoryError) res.render("error", { error: categoryError.message });
    res.render("new_item", { scientists, categories });
  } catch (err) {
    res.render("error", { error: err.message });
  }
};

exports.createItem = async (req, res) => {
  try {
    const { name, quantity, scientist_id, category_id } = req.body;

    if (!name || !quantity || !scientist_id || !category_id) {
      return res.render("error", { error: "All fields are required" });
    }

    const { error } = await supabase
      .from("items")
      .insert([{ name, quantity, scientist_id, category_id }]);

    if (error) return res.render("error", { error: error.message });

    res.redirect("/items");
  } catch (err) {
    res.render("error", { error: err.message });
  }
};

exports.renderEditItemForm = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch the item
    const { data: item, error: itemError } = await supabase
      .from("items")
      .select("*")
      .eq("id", id)
      .single();
    if (itemError || !item) {
      return res.render("error", { error: "Item not found" });
    }

    // Fetch scientists
    const { data: scientists, error: scientistsError } = await supabase
      .from("scientists")
      .select("id, name");
    if (scientistsError) throw scientistsError;

    res.render("edit_item", { item, scientists });
  } catch (err) {
    res.render("error", { error: err.message });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, quantity, scientist_id } = req.body;

    const { error } = await supabase
      .from("items")
      .update({ name, quantity, scientist_id })
      .eq("id", id);

    if (error) throw error;
    res.redirect("/items");
  } catch (err) {
    res.render("error", { error: err.message });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from("items").delete().eq("id", id);

    if (error) throw error;
    res.redirect("/items");
  } catch (err) {
    res.render("error", { error: err.message });
  }
};
