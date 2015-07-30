#!/usr/bin/ruby

def sh(c)
	outl = []
	IO.popen(c) do |f|
		while not f.eof?
			tval = f.gets
			puts tval
			outl.push(tval)
		end
	end
	return outl.join("")
end

def cat(c)
	outl = []
	f = File.open(c, "r")
	f.each do |line|
		outl.push(line)
	end
	f.close
	return outl.join("")
end

def writef(fn, c)
	File.open(fn, "w") do |f|
		f.puts(c)
	end
end

def readf(fn)
  return File.open(fn, 'r') do |f|
  	f.read()
  end
end

ver = nil
begin
	ver = (cat 'version.txt').split('\n')[0].to_i
rescue
	puts "no version.txt"
	exit
end
$ver = ver

def redirouthtm_url(turl)
return <<eos
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="REFRESH" content="0; url=#{turl}">
<link rel="canonical" href="#{turl}" />
<title>Redirecting</title>
</head>
<body>
<script>
window.location.replace("#{turl}");
</script>
</body>
</html>
eos
end

def rediroutphp_url(turl)
return <<eos
<?php
header( 'Location: #{turl}' ) ;
?>
eos
end

def sfurl(outstr)
return "http://downloads.sourceforge.net/unetbootin/#{outstr}"
end

def lpurl(outstr)
return "http://launchpad.net/unetbootin/trunk/#{$ver}/+download/#{outstr}"
end

$tourl = lambda {|x| lpurl(x) }

download_site = 'lp' # sf or lp
if download_site == 'sf'
	$tourl = lambda {|x| sfurl(x) }
end

def redirouthtm(outstr)
return redirouthtm_url($tourl.call(outstr))
end

def rediroutphp(outstr)
return rediroutphp_url($tourl.call(outstr))
end

writef('unetbootin-linux-latest/index.html'        , redirouthtm("unetbootin-linux-#{ver}.bin"))
writef('unetbootin-linux-latest/index.php'         , rediroutphp("unetbootin-linux-#{ver}.bin"))
writef('unetbootin-linux64-latest/index.html'      , redirouthtm("unetbootin-linux64-#{ver}.bin"))
writef('unetbootin-linux64-latest/index.php'       , rediroutphp("unetbootin-linux64-#{ver}.bin"))
writef('unetbootin-windows-latest.exe/index.html'  , redirouthtm("unetbootin-windows-#{ver}.exe"))
writef('unetbootin-windows-latest.exe/index.php'   , rediroutphp("unetbootin-windows-#{ver}.exe"))
writef('unetbootin-mac-latest.zip/index.html'      , redirouthtm("unetbootin-mac-#{ver}.zip"))
writef('unetbootin-mac-latest.zip/index.php'       , rediroutphp("unetbootin-mac-#{ver}.zip"))
writef('unetbootin-source-latest.zip/index.html'   , redirouthtm("unetbootin-source-#{ver}.zip"))
writef('unetbootin-source-latest.zip/index.php'    , rediroutphp("unetbootin-source-#{ver}.zip"))
writef('unetbootin-source-latest.tar.gz/index.html', redirouthtm("unetbootin-source-#{ver}.tar.gz"))
writef('unetbootin-source-latest.tar.gz/index.php' , rediroutphp("unetbootin-source-#{ver}.tar.gz"))

def sub_redirects(infile, outfile)
	contents = readf(infile)
	for x in ['unetbootin-linux-latest.bin', 'unetbootin-linux64-latest.bin', 'unetbootin-windows-latest.exe', 'unetbootin-mac-latest.zip', 'unetbootin-source-latest.zip', 'unetbootin-source-latest.tar.gz']
		url = $tourl.call(x.sub('latest', $ver.to_s()))
	  contents = contents.gsub(x, url)
	end
	writef(outfile, contents)
end

sub_redirects('index_template.html', 'index.html')
sub_redirects('linux_download_template.html', 'linux_download.html')

if ARGV.include?('upload') or ARGV.include?('push')
  sh 'git commit -a -m "updated website"'
  sh 'git push origin master'
  sh 'rsync -avP --exclude .git -e ssh . gezakovacs,unetbootin@frs.sourceforge.net:/home/groups/u/un/unetbootin/htdocs'
end
