class User < ApplicationRecord
  # Scope to filter users by location parameters
  scope :filter_by_location, ->(params) {
    where(params.slice(:continent, :country, :state, :city).transform_values(&:presence).compact)
  }


  def self.distinct_locations
    {
      continents: distinct_ordered(:continent),
      countries: distinct_ordered(:country),
      states: distinct_ordered(:state),
      cities: distinct_ordered(:city)
    }
  end

  def self.distinct_ordered(attribute)
    distinct.pluck(attribute).compact.sort
  end
end
