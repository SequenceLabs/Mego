class Middleman::Templates::Sequence < Middleman::Templates::Base
  def self.source_root
    File.join(File.dirname(__FILE__), 'sequence')
  end
  
  def build_scaffold
    template "config.tt", File.join(location, "config.rb")
    template "config.ru", File.join(location, "config.ru")
    directory "source", File.join(location, "source")
  end
end

Middleman::Templates.register(:sequence, Middleman::Templates::Sequence)