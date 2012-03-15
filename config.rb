class Middleman::Templates::Sequence < Middleman::Templates::Base

	
	class_option :css_dir, :default => "css"
	class_option :js_dir, :default => "js"
	class_option :images_dir, :default => "img"

	def self.source_root
		File.join(File.dirname(__FILE__), 'sequence')
	end

	def build_scaffold
		template "config.tt", File.join(location, "config.rb")
		template "config.ru", File.join(location, "config.ru")
		directory "source", File.join(location, "source")
	end

end


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

set :css_dir, "css"
Middleman::Templates.register(:sequence, Middleman::Templates::Sequence)