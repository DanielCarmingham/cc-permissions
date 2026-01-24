# ruby

Ruby, Bundler, Rails, and Rake

**Category:** Languages & Runtimes

## Restrictive

Read-only operations safe for exploration and code review.

| Command | Description |
|---------|-------------|
| `ruby --version` | Check Ruby version |
| `ruby -v` | Check Ruby version |
| `ruby --help` | Ruby help |
| `gem --version` | Check gem version |
| `gem -v` | Check gem version |
| `gem list` | List installed gems |
| `gem search` | Search RubyGems |
| `gem info` | Show gem info |
| `gem specification` | Show gem specification |
| `gem environment` | Show gem environment |
| `gem outdated` | List outdated gems |
| `bundle --version` | Check Bundler version |
| `bundle version` | Check Bundler version |
| `bundle show` | Show gem location |
| `bundle list` | List bundled gems |
| `bundle outdated` | List outdated gems |
| `bundle check` | Check gem requirements |
| `bundle info` | Show gem info |
| `bundle config list` | List bundle config |
| `rails --version` | Check Rails version |
| `rails -v` | Check Rails version |
| `rails about` | Show Rails info |
| `rails routes` | List routes |
| `rails stats` | Show code stats |
| `rake --version` | Check Rake version |
| `rake -T` | List rake tasks |
| `rake -D` | Describe rake tasks |

## Standard

Day-to-day development commands. Includes all restrictive commands plus:

| Command | Description |
|---------|-------------|
| `bundle exec` | Execute with bundled gems |
| `rails server` | Start Rails server |
| `rails s` | Start Rails server |
| `rails console` | Start Rails console |
| `rails c` | Start Rails console |
| `rails dbconsole` | Start database console |
| `rails generate` | Run generator |
| `rails g` | Run generator |
| `rails destroy` | Undo generator |
| `rails d` | Undo generator |
| `rails assets:precompile` | Precompile assets |
| `rails assets:clean` | Clean assets |
| `rake` | Run rake task |
| `rake test` | Run tests |
| `rake spec` | Run RSpec tests |
| `rspec` | Run RSpec |
| `rubocop` | Run RuboCop |
| `rubocop -a` | Run RuboCop with auto-fix |
| `rubocop -A` | Run RuboCop with aggressive auto-fix |
| `ruby` | Run Ruby script |

## Permissive

Broader access for trusted projects. Includes all standard commands plus:

| Command | Description |
|---------|-------------|
| `gem install` | Install gem |
| `gem uninstall` | Uninstall gem |
| `gem update` | Update gems |
| `gem cleanup` | Clean old gems |
| `bundle install` | Install bundled gems |
| `bundle update` | Update bundled gems |
| `bundle add` | Add gem to Gemfile |
| `bundle remove` | Remove gem from Gemfile |
| `bundle config set` | Set bundle config |
| `bundle clean` | Clean unused gems |
| `rails db:create` | Create database |
| `rails db:drop` | Drop database |
| `rails db:migrate` | Run migrations |
| `rails db:rollback` | Rollback migration |
| `rails db:seed` | Seed database |
| `rails db:reset` | Reset database |
| `rails db:setup` | Setup database |
| `rails new` | Create new Rails app |
