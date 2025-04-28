CREATE TABLE `scenario_actions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`remarks` text NOT NULL,
	`scenario_id` integer NOT NULL,
	FOREIGN KEY (`scenario_id`) REFERENCES `scenarios`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `scenarios` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`event_name` text NOT NULL
);
