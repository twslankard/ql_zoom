require 'fileutils'
require 'pathname'
require 'yui/compressor'
require 'closure-compiler'

namespace :js do

  desc "Compress jquery.ql_zoom.js with YUI"

  task :yui do
    compress_yui('src/jquery.ql_zoom.js')
  end

  desc "Compress jquert.ql_zoom.js with Closure"

  task :closure do
    compress_closure('src/jquery.ql_zoom.js')
  end

  def compress_closure(path)
    puts "Compressing #{path}"
    file_handle = File.open(path)
    compressed_output = Closure::Compiler.new.compile(file_handle)
    file_handle.close

    #overwrite the file
    File.open('src/jquery.ql_zoom.min.js', "w+") { |file| file.puts compressed_output }

  end


  def compress_yui(path)
    puts "Compressing #{path}"
    file_handle = File.open(path)
    compressor = YUI::JavaScriptCompressor.new
    compressed_output = compressor.compress(file_handle)
    file_handle.close

    #overwrite the file
    File.open('src/jquery.ql_zoom.min.js', "w+") { |file| file.puts compressed_output }
  end

end

task :default => 'js:closure'
