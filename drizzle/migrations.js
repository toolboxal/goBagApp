// This file is required for Expo/React Native SQLite migrations - https://orm.drizzle.team/quick-sqlite/expo

import journal from './meta/_journal.json';
import m0000 from './0000_old_centennial.sql';
import m0001 from './0001_fair_robin_chapel.sql';
import m0002 from './0002_tan_stark_industries.sql';
import m0003 from './0003_messy_dragon_lord.sql';
import m0004 from './0004_boring_guardian.sql';
import m0005 from './0005_heavy_lila_cheney.sql';
import m0006 from './0006_bored_menace.sql';
import m0007 from './0007_aspiring_warhawk.sql';
import m0008 from './0008_wild_raider.sql';

  export default {
    journal,
    migrations: {
      m0000,
m0001,
m0002,
m0003,
m0004,
m0005,
m0006,
m0007,
m0008
    }
  }
  