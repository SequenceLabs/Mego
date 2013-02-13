# pretty URLS
# activate :directory_indexes

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
compass_config do |compass|
  compass.sass_options = {:debug_info => true}
end
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
  def form_textbox(id="", label="Label", placeholder="Enter text", required=false, errormsg="This field must be filled in", accesskey="")
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
      <span class="field-required" title="Required">*</span>
    HTML
    end
    haml_concat <<-"HTML".gsub( /^\s+/, '' )
        </label>
    HTML

    haml_concat <<-"HTML".gsub( /^\s+/, '' )
        <input id="#{id}" name="#{id}" type="text" placeholder="#{placeholder}" class="field-textbox" />
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
  # Render textarea
  def form_textarea(id="", label="Label", placeholder="Enter text", required=false, errormsg="This field must be filled in", accesskey="")
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
      <span class="field-required" title="Required">*</span>
    HTML
    end
    haml_concat <<-"HTML".gsub( /^\s+/, '' )
        </label>
    HTML

    haml_concat <<-"HTML".gsub( /^\s+/, '' )
      <textarea id="#{id}" name="#{id}" placeholder="#{placeholder}" class="field-textbox"></textarea>
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
  # Render checkbox
  def form_checkbox(id="", label="Label")
    haml_concat <<-"HTML".gsub( /^\s+/, '' )
      <div class="field">
        <input id="#{id}" name="#{id}" type="checkbox" />
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
  # Render checkboxList
  def form_checkboxlist(num=3, legendName="Checkbox List", required=false)
    haml_concat <<-"HTML".gsub( /^\s+/, '' )
      <fieldset class="field-checkboxlist">
        <legend>
          <span>
            #{legendName}
    HTML
    if required == true # add a required * if necessary
    haml_concat <<-"HTML".gsub( /^\s+/, '' )
      <span class="field-required" title="Required">*</span>
    HTML
    end
    haml_concat <<-"HTML".gsub( /^\s+/, '' )
          </span>
        </legend>
    HTML
    count = 1
    while count <= num
      form_checkbox("checkbox_"+count.to_s, "checkbox #"+count.to_s)
      count += 1
    end

    haml_concat <<-"HTML".gsub( /^\s+/, '' )
      </fieldset>
    HTML

  end

  # ----------------------------
  # Render radio buttons - not used directly
  def form_radio(id="", label="Label", groupName="")
    haml_concat <<-"HTML".gsub( /^\s+/, '' )
      <div class="field">
        <input id="#{id}" name="#{groupName}" type="radio" />
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
  # Render radio buttons List
  def form_radiolist(num=3, legendName="Radio List", required=false)
    haml_concat <<-"HTML".gsub( /^\s+/, '' )
      <fieldset class="field-radiolist">
        <legend>
          <span class="legend">
            #{legendName}
    HTML
    if required == true # add a required * if necessary
    haml_concat <<-"HTML".gsub( /^\s+/, '' )
      <span class="field-required" title="Required">*</span>
    HTML
    end
    haml_concat <<-"HTML".gsub( /^\s+/, '' )
          </span>
        </legend>
    HTML
    count = 1
    o =  [('a'..'z'),('A'..'Z')].map{|i| i.to_a}.flatten
    string  =  (0...50).map{ o[rand(o.length)] }.join
    while count <= num
      form_radio("radio_"+count.to_s, "radio #"+count.to_s, string)
      count += 1
    end

    haml_concat <<-"HTML".gsub( /^\s+/, '' )
      </fieldset>
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
      <span class="field-required" title="Required">*</span>
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
  def img_placehold(width="200", height="200")
    placehold_params = "#{width}x#{height}"
    
    placehold_url = "http://www.imgsrc.me/" + placehold_params

    haml_concat <<-"HTML".gsub( /^\s+/, '' )
      <img src="#{placehold_url}" width="#{width}" height="#{height}" />
    HTML

  end


end # end of helpers

