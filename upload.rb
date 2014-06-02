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

ver = nil
begin
	ver = (cat 'version.txt').split('\n')[0].to_i
rescue
	puts "no version.txt"
	exit
end
$ver = ver

def sfredirouthtm(outstr)
return <<eos
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
<html>
<head>
<title></title>
<meta http-equiv="REFRESH" content="0;url=http://downloads.sourceforge.net/unetbootin/#{outstr}">
</head>
<body></body>
</html>
eos
end

def sfrediroutphp(outstr)
return <<eos
<?php
header( 'Location: http://downloads.sourceforge.net/unetbootin/#{outstr}' ) ;
?>
eos
end

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

def redirouthtm(outstr)
return redirouthtm_url("http://launchpad.net/unetbootin/trunk/#{$ver}/+download/#{outstr}")
end

def rediroutphp(outstr)
return <<eos
<?php
header( 'Location: http://launchpad.net/unetbootin/trunk/#{$ver}/+download/#{outstr}' ) ;
?>
eos
end

writef('unetbootin-linux-latest/index.html'        , sfredirouthtm("unetbootin-linux-#{ver}.bin"))
writef('unetbootin-linux-latest/index.php'         , sfrediroutphp("unetbootin-linux-#{ver}.bin"))
writef('unetbootin-windows-latest.exe/index.html'  , sfredirouthtm("unetbootin-windows-#{ver}.exe"))
writef('unetbootin-windows-latest.exe/index.php'   , sfrediroutphp("unetbootin-windows-#{ver}.exe"))
writef('unetbootin-mac-latest.zip/index.html'      , sfredirouthtm("unetbootin-mac-#{ver}.zip"))
writef('unetbootin-mac-latest.zip/index.php'       , sfrediroutphp("unetbootin-mac-#{ver}.zip"))
writef('unetbootin-source-latest.zip/index.html'   , sfredirouthtm("unetbootin-source-#{ver}.zip"))
writef('unetbootin-source-latest.zip/index.php'    , sfrediroutphp("unetbootin-source-#{ver}.zip"))
writef('unetbootin-source-latest.tar.gz/index.html', sfredirouthtm("unetbootin-source-#{ver}.tar.gz"))
writef('unetbootin-source-latest.tar.gz/index.php' , sfrediroutphp("unetbootin-source-#{ver}.tar.gz"))

sh 'git commit -a -m "updated website"'
sh 'git push origin master'
sh 'rsync -avP --exclude .git -e ssh . gezakovacs,unetbootin@frs.sourceforge.net:/home/groups/u/un/unetbootin/htdocs'
