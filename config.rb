# pretty URLS
activate :directory_indexes

# ----------------------------
# Set directories (optional)
set :css_dir, "css"
set :images_dir, "images"
set :js_dir, "js"

# ----------------------------
# Build-specific configuration
configure :build do

  # Set directories to relative
  activate :relative_assets

  # Change the output style for deployment
  # activate :minify_css

  # Minify Javascript on build
  # activate :minify_javascript

  # Enable cache buster
  # activate :cache_buster

  # Use relative URLs
  # activate :relative_assets

  # Compress PNGs after build
  # First: gem install middleman-smusher
  # require "middleman-smusher"
  # activate :smusher

  # Or use a different image path
  # set :http_path, "/Content/images/"

end

# ----------------------------
# Helpers
helpers do

  def custom_html_tag(lang="en", &block)
  haml_concat <<-"HTML".gsub( /^\s+/, '' )
    <!--[if lt IE 7 ]>              <html lang="#{lang}" class="no-js ie6"> <![endif]-->
      <!--[if IE 7 ]>                 <html lang="#{lang}" class="no-js ie7"> <![endif]-->
      <!--[if IE 8 ]>                 <html lang="#{lang}" class="no-js ie8"> <![endif]-->
      <!--[if IE 9 ]>                 <html lang="#{lang}" class="no-js ie9"> <![endif]-->
      <!--[if (gte IE 9)|!(IE)]><!--> <html lang="#{lang}" class="no-js"> <!--<![endif]-->
  HTML
  haml_concat capture(&block) << ("\n</html>") if block_given?
  end

end




