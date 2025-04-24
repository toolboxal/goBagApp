PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_contacts` (
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
	`priority` text DEFAULT 'normal' NOT NULL,
	`accounted` integer DEFAULT false NOT NULL,
	`latitude` real DEFAULT 0,
	`longitude` real DEFAULT 0
);
--> statement-breakpoint
INSERT INTO `__new_contacts`("id", "name", "phoneNumber", "email", "address", "cong", "fs_group", "role", "emergency_person", "emergency_person_number", "priority", "accounted", "latitude", "longitude") SELECT "id", "name", "phoneNumber", "email", "address", "cong", "fs_group", "role", "emergency_person", "emergency_person_number", "priority", "accounted", "latitude", "longitude" FROM `contacts`;--> statement-breakpoint
DROP TABLE `contacts`;--> statement-breakpoint
ALTER TABLE `__new_contacts` RENAME TO `contacts`;--> statement-breakpoint
PRAGMA foreign_keys=ON;