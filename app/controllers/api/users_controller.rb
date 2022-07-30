class Api::UsersController < ApplicationController
  
    def create
        user = User.new(user_params)
        if user
          session[:user_id] = user.id
          render json: {
            status:created,
            user:user
          }
        else
          render json: {status: 500 }
        end
      end
    
      private
    
      def user_params
        params.require(:user).permit(
          :first_name,
          :last_name,
          :handle,
          :email,
          :country,
          :password,
          :password_confirmation,
          :profile_image,
          :city,
          :phone
        )
      end
  end
  



# class Api::UsersController < ApplicationController
#   skip_before_action :authenticate_user

#   def show
#       if current_user
#           render json: current_user, status: :ok
#       else
#           render json: "Not authenticated", status: :unauthorized
#       end
#   end

#   def create
#       user = User.create(user_params)
#       if user.valid?
#           session[:user_id] = user.id
#           render json: user, status: :created
#       else
#           render json: user.errors.full_messages, status: :unprocessable_entity
#       end
#   end

#   private

#   def user_params
#       params.permit(:username, :email, :password, :password_confirmation)
#   end
# end
