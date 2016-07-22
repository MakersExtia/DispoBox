CREATE TABLE `current_state` (
	`id` int(5) NOT NULL AUTO_INCREMENT,
	`name` varchar(50) DEFAULT NULL,
	`state` int(5) DEFAULT '-1',
	PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1