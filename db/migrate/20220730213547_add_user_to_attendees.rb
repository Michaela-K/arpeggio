class AddUserToAttendees < ActiveRecord::Migration[7.0]
  def change
    add_reference :attendees, :user, null: false, foreign_key: true
  end
end
