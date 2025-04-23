CREATE TABLE `contacts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`phoneNumber` text NOT NULL,
	`email` text,
	`address` text,
	`cong` text NOT NULL,
	`fs_group` text,
	`role` text DEFAULT 'pub' NOT NULL,
	`emergency_person` text,
	`emergency_person_number` text,
	`priority` text DEFAULT 'medium' NOT NULL,
	`accounted` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_store_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`quantity` integer NOT NULL,
	`date_expiry` text,
	`category` text DEFAULT 'food' NOT NULL,
	`notes` text,
	`photo_url` text
);
--> statement-breakpoint
INSERT INTO `__new_store_items`("id", "name", "quantity", "date_expiry", "category", "notes", "photo_url") SELECT "id", "name", "quantity", "date_expiry", "category", "notes", "photo_url" FROM `store_items`;--> statement-breakpoint
DROP TABLE `store_items`;--> statement-breakpoint
ALTER TABLE `__new_store_items` RENAME TO `store_items`;--> statement-breakpoint
PRAGMA foreign_keys=ON;