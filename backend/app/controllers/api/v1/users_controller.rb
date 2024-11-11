class Api::V1::UsersController < ApplicationController
  def index
    @users = User.filter_by_location(filter_params)

    render json: {
      users: @users.map { |user| user_data(user) }
    }
  end

  def locations
    render json: User.distinct_locations
  end

  private

  def filter_params
    params.permit(:continent, :country, :state, :city)
  end

  def user_data(user)
    {
      id: user.id,
      name: user.name,
      continent: user.continent,
      country: user.country,
      state: user.state,
      city: user.city
    }
  end
end
