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
    const { data: item, error } = await supabase
      .from("items")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !item) {
      return res.render("error", { error: "Item not found" });
    }

    res.render("item", { item });
  } catch (err) {
    res.render("error", { error: "Item not found" });
  }
};

exports.renderAddItemForm = async (req, res) => {
  try {
    const { data: scientists, error } = await supabase
      .from("scientists")
      .select("id, name");
    if (error) throw error;
    res.render("new_item", { scientists });
  } catch (err) {
    res.render("error", { error: err.message });
  }
};

exports.createItem = async (req, res) => {
  try {
    const { name, quantity, scientist_id } = req.body;

    if (!name || !quantity || !scientist_id) {
      return res.render("error", { error: "All fields are required" });
    }

    const { error } = await supabase
      .from("items")
      .insert([{ name, quantity, scientist_id }]);

    if (error) throw error;
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
