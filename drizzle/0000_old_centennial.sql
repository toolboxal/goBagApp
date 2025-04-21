CREATE TABLE `store_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`quantity` integer NOT NULL,
	`date_expiry` text NOT NULL,
	`category` text DEFAULT 'food',
	`photo_url` text
);
