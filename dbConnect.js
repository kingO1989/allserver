var path = require("path");
const { createClient } = require('@supabase/supabase-js');
if (process.env.NODE_ENV === "production") {
  require('dotenv').config({ path: path.resolve(__dirname, `env.production`) })
}
else { r = require('dotenv').config({ path: path.resolve(__dirname, `development.env`) }) }


const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY

);


module.exports = supabase;