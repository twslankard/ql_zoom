require 'fileutils'
require 'pathname'
require 'yui/compressor'
require 'closure-compiler'

namespace :js do

  desc "Compress monkeyfist.js with YUI"

  task :yui do
    compress_yui('src/monkeyfist.js')
  end

  desc "Compress monkeyfist.js with Closure"

  task :closure do
    compress_closure('src/monkeyfist.js')
  end

  def compress_closure(path)
    puts "Compressing #{path}"
    file_handle = File.open(path)
    compressed_output = Closure::Compiler.new.compile(file_handle)
    file_handle.close

    #overwrite the file
    File.open('monkeyfist.min.js', "w+") { |file| file.puts compressed_output }

  end


  def compress_yui(path)
    puts "Compressing #{path}"
    file_handle = File.open(path)
    compressor = YUI::JavaScriptCompressor.new
    compressed_output = compressor.compress(file_handle)
    file_handle.close

    #overwrite the file
    File.open('monkeyfist.min.js', "w+") { |file| file.puts compressed_output }
  end

end

task :default => 'js:closure'
