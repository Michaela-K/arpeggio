class RemoveUserFromEvents < ActiveRecord::Migration[7.0]
  def change
    remove_column :events, :user_id, :integer
  end
end
