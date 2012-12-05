# pretty URLS
# activate :directory_indexes

# ----------------------------
# Set directories (optional)
set :css_dir, "css"
set :images_dir, "images"
set :js_dir, "js"
set :nav, @nav

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
# compass_config do |compass|
#   compass.sass_options = {:debug_info => true}
# end
# ----------------------------
# Helpers
helpers do

  # ----------------------------
  # Default HTML tag - do not remove!
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

  # ----------------------------
  # Render textbox
  def form_textbox(id="", label="Label", placeholder="Enter text", required=false, textboxtype="text", errormsg="This field must be filled in", accesskey="")
    haml_concat <<-"HTML".gsub( /^\s+/, '' )
      <div class="field">
    HTML

    if accesskey != "" # add accesskey to label if necessary
      haml_concat <<-"HTML".gsub( /^\s+/, '' )
          <label for="#{id}" accesskey="#{accesskey}">
      HTML
    else
    haml_concat <<-"HTML".gsub( /^\s+/, '' )
        <label for="#{id}">
    HTML
    end
    haml_concat <<-"HTML".gsub( /^\s+/, '' )
        #{label}
    HTML

    if required == true # add a required * if necessary
    haml_concat <<-"HTML".gsub( /^\s+/, '' )
      <span title="Required">*</span>
    HTML
    end
    haml_concat <<-"HTML".gsub( /^\s+/, '' )
        </label>
    HTML

    # render input textbox or textarea
    if textboxtype == "textarea"
    haml_concat <<-"HTML".gsub( /^\s+/, '' )
      <textarea id="#{id}" name="#{id}" placeholder="#{placeholder}" class="field-textbox"></textarea>
    HTML
    else
    haml_concat <<-"HTML".gsub( /^\s+/, '' )
        <input id="#{id}" name="#{id}" type="#{textboxtype}" placeholder="#{placeholder}" class="field-textbox" />
    HTML
    end

    # error message if required=true
    if required == true
    haml_concat <<-"HTML".gsub( /^\s+/, '' )
      <span class="field-error">#{errormsg}</span>
    HTML
    end

    # finish - wrapping up now
    haml_concat <<-"HTML".gsub( /^\s+/, '' )
      </div>
    HTML
  end

  # ----------------------------
  # Render checkbox
  def form_checkbox(id="", label="Label")
    haml_concat <<-"HTML".gsub( /^\s+/, '' )
      <div class="field field-checkbox">
        <input id="#{id}" name="#{id}" type="checkbox" class="field-checkbox" />
        <label for="#{id}">
          #{label}
        </label>
    HTML

    # finish - wrapping up now
    haml_concat <<-"HTML".gsub( /^\s+/, '' )
      </div>
    HTML

  end

  # ----------------------------
  # Render selectbox
  def form_selectbox(id="", label="Label", required=false, selectboxtype="select", errormsg="Something must be selected")
    haml_concat <<-"HTML".gsub( /^\s+/, '' )
      <div class="field">
        <label for="#{id}">
          #{label}
    HTML
    if required == true # add a required * if necessary
    haml_concat <<-"HTML".gsub( /^\s+/, '' )
      <span title="Required">*</span>
    HTML
    end
    haml_concat <<-"HTML".gsub( /^\s+/, '' )
        </label>
    HTML

    # render input selectbox or multibox
    if selectboxtype == "multi"
    haml_concat <<-"HTML".gsub( /^\s+/, '' )
      <select id="#{id}" name="#{id}" multiple="multiple" class="field-selectbox" size="3" />
    HTML
    else
    haml_concat <<-"HTML".gsub( /^\s+/, '' )
        <select id="#{id}" name="#{id}" class="field-selectbox" />
    HTML
    end

    haml_concat <<-"HTML".gsub( /^\s+/, '' )
      <option value="1" selected="selected">All</option>
      <option value="2">Option 2</option>
      <option value="3">Option 3</option>
      <option value="4">Option 4</option>
    </select>
    HTML

    # error message if required=true
    if required == true
    haml_concat <<-"HTML".gsub( /^\s+/, '' )
      <span class="field-error">#{errormsg}</span>
    HTML
    end

    # finish - wrapping up now
    haml_concat <<-"HTML".gsub( /^\s+/, '' )
      </div>
    HTML

  end

  # ----------------------------
  # Render placeholder image
  def img_placehold(width="200", height="200", text="", background="dddddd", forecolour="858585", font="Helvetica", fontsize="24")
    placehold_params = "#{width}x#{height}/#{background}/#{forecolour}"
    placehold_url = "http://www.imgsrc.me/" + placehold_params

    haml_concat <<-"HTML".gsub( /^\s+/, '' )
      <img src="#{placehold_url}" width="#{width}" height="#{height}" />
    HTML
  end
end # end of helpers

ready do
  sitemap.resources.find_all{|p| p.source_file.match(/\.html/)}.each do |page|
    if page.data.dynamic_pages && !page.proxy?
      page.data.dynamic_pages.each do |dynamic_page|
        page "/#{page.data.parent}/#{dynamic_page}.html", :proxy => "#{page.url}" do

        end
      end
    end
  end
end

