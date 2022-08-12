Rails.application.routes.draw do
  namespace :api do
    resources :users
    resources :events
    resources :event_instruments
    resources :sessions, only: [:create]

    get :logged_in, to: "sessions#logged_in"
    delete :logout, to: "sessions#logout"
    post :signup, to: "users#create"
    post :new_event, to: "events#create"
    get "/myprofile", to: "users#show"
    get "/events/search/:city/:level/:genre/:instrument", to: "events#search"
    get "/events/instruments/:instrument", to: "events#instruments"
    put "/event_instruments/:event_id", to: "event_instruments#update"
    post "/rails/active_storage/direct_uploads", to: "direct_uploads#create"
    get "/users/:id/instruments", to: "users#instruments"
    get "/users/:user_id/sessions", to: "events#mysessions"
  end

  get "*path", to: "fallback#index", constraints: ->(req) { !req.xhr? && req.format.html? }
end


