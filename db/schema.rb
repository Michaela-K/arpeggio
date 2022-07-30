# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2022_07_29_040032) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "attendees", force: :cascade do |t|
    t.integer "user_id"
    t.integer "event_instrument_id"
    t.boolean "accepted"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "event_instruments", force: :cascade do |t|
    t.integer "event_id"
    t.integer "instrument_id"
    t.integer "quantity"
    t.string "status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "events", force: :cascade do |t|
    t.integer "user_id"
    t.string "title"
    t.integer "event_date"
    t.integer "start_time"
    t.integer "end_time"
    t.string "city"
    t.string "country"
    t.string "level"
    t.string "venue_style"
    t.string "genre"
    t.string "event_image"
    t.string "description"
    t.boolean "post_active"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "instruments", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "user_favourites", force: :cascade do |t|
    t.integer "event_id"
    t.integer "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "user_instruments", force: :cascade do |t|
    t.integer "user_id"
    t.integer "instrument_id"
    t.string "level"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "users", force: :cascade do |t|
    t.string "first_name"
    t.string "last_name"
    t.string "handle"
    t.string "email"
    t.string "password"
    t.integer "phone"
    t.string "profile_image"
    t.string "city"
    t.string "country"
    t.boolean "profile_public"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

end