Note that UNetbootin now has an option for creating persistence files on Ubuntu liveUSB drives, hence these instructions are no longer necessary.

Go to http://unetbootin.sourceforge.net/diskimg/ and download one of the files (128mb.zip, 256mb.zip, or 512mb.zip) corresponding to the amount of persistent space you want (make sure the size of the persistent disk image is smaller than the free space you have on your USB drive).

Now extract the file "casper.rw" from the zip file to your USB drive.

Now edit D:\syslinux.cfg (assuming D:\ is where your USB drive is) and add in "persistent" at the end of the line that begins with "append", and save the file, so your syslinux.cfg should look something like this:

default unetbootin
label unetbootin
	kernel /ubnkern
	append initrd=/ubninit file=/cdrom/preseed/ubuntu.seed boot=casper quiet splash persistent --

For more info see https://help.ubuntu.com/community/LiveCD/Persistence
