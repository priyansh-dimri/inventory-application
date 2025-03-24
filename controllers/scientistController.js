const supabase = require("../config/db");

exports.getAllScientists = async (req, res) => {
  try {
    const { data, error } = await supabase.from("scientists").select("*");
    if (error) throw error;
    res.render("scientists", { scientists });
  } catch (error) {
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

    if (itemsError) throw itemsError;

    res.render("scientist", { scientist });
  } catch (error) {
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
    const { error } = await supabase.from("scientists").delete().eq("id", id);

    if (error) throw error;
    res.redirect("/scientists");
  } catch (err) {
    res.render("error", { error: err.message });
  }
};
