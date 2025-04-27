PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_contacts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`phoneNumber` text,
	`remarks` text,
	`priority` text DEFAULT 'normal' NOT NULL,
	`accounted` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_contacts`("id", "name", "phoneNumber", "remarks", "priority", "accounted") SELECT "id", "name", "phoneNumber", "remarks", "priority", "accounted" FROM `contacts`;--> statement-breakpoint
DROP TABLE `contacts`;--> statement-breakpoint
ALTER TABLE `__new_contacts` RENAME TO `contacts`;--> statement-breakpoint
PRAGMA foreign_keys=ON;