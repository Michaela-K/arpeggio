class AddUserToUserInstruments < ActiveRecord::Migration[7.0]
  def change
    add_reference :user_instruments, :user, null: false, foreign_key: true
  end
end
