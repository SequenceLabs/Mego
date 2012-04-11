require 'rubygems'
require 'middleman'

run Middleman::Server

require "rack/contrib/try_static"
use Rack::TryStatic, :root => "build", :urls => %w[/], :try => ['.html']