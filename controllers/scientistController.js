const supabase = require("../config/db");

exports.getAllScientists = async (req, res) => {
  try {
    const { data: scientists, error } = await supabase
      .from("scientists")
      .select("*");
    if (error) throw error;
    res.render("scientists", { scientists });
  } catch (err) {
    res.render("error", { error: err.message });
  }
};

exports.renderAddScientistForm = async (req, res) => {
  res.render("new_scientist");
};

exports.getScientistById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data: scientist, error: scientistError } = await supabase
      .from("scientists")
      .select("*")
      .eq("id", id)
      .single();
    if (scientistError || !scientist) {
      return res.render("error", { error: "Scientist not found" });
    }

    // Fetch items related to the scientist
    const { data: items, error: itemsError } = await supabase
      .from("items")
      .select("id, name, quantity")
      .eq("scientist_id", id);

    if (itemsError) {
      return res.render("error", { error: "Item not found" });
    }

    res.render("scientist", { scientist, items });
  } catch (err) {
    res.render("error", { error: err.message });
  }
};

exports.createScientist = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.render("error", { error: "Name and email are required" });
    }

    const { error } = await supabase
      .from("scientists")
      .insert([{ name, email }]);

    if (error) throw error;
    res.redirect("/scientists");
  } catch (err) {
    res.render("error", { error: err.message });
  }
};

exports.renderEditScientistForm = async (req, res) => {
  try {
    const { id } = req.params;
    const { data: scientist, error } = await supabase
      .from("scientists")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    res.render("edit_scientist", { scientist });
  } catch (err) {
    res.render("error", { error: "Scientist not found" });
  }
};

exports.updateScientist = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    const { error } = await supabase
      .from("scientists")
      .update({ name, email })
      .eq("id", id);

    if (error) throw error;
    res.redirect("/scientists");
  } catch (err) {
    res.render("error", { error: err.message });
  }
};

exports.deleteScientist = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if any items are associated with this scientist
    const { data: items, error: itemsError } = await supabase
      .from("items")
      .select("id")
      .eq("scientist_id", id);

    if (itemsError) {
      return res
        .status(500)
        .render("error", { message: "Error checking scientist dependencies" });
    }

    if (items.length > 0) {
      return res
        .status(400)
        .render("error", {
          message: "Cannot delete scientist as they have associated items",
        });
    }

    // Proceed with deletion if no items are linked
    const { error } = await supabase.from("scientists").delete().eq("id", id);

    if (error) {
      return res
        .status(500)
        .render("error", { message: "Error deleting scientist" });
    }

    res.redirect("/scientists");
  } catch (err) {
    res
      .status(500)
      .render("error", { message: "An unexpected error occurred" });
  }
};
