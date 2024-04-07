export interface Event {
  timestamp: string;
  duration: number;
  data: any;
  category: string[];
}
export interface RawEvent {
  id: number;
  timestamp: string;
  duration: number;
  data: any;
}
// Screentime is stored in day-level objects that have
// their `events` appended when new data is added.
export interface ScreenTimeData {
  userId: string;
  public: boolean;
  date: string;
  events: Event[];
}

// Same as above, but with events aggregated
export interface ScreenTimeSummary {
  userId: string;
  total: number;
  date: string;
  categoryTotals: { [key: string]: number };
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor: string;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface Rule {
  type: "regex" | "none";
  regex?: RegExp
  ignore_case?: boolean;
}

export interface Category {
  id?: number;
  name: string[];
  name_pretty?: string;
  subname?: string;
  rule: Rule;
  data?: Record<string, any>;
  depth?: number;
  parent?: string[];
  children?: Category[];
}

export const defaultCategories: Category[] = [
  {
    name: ["Work"],
    rule: {type: "regex", regex: /Google Docs|libreoffice|ReText/gi},
  },
  {
    name: ["Work", "Programming"],
    rule: {
      type: "regex",
      // eslint-disable-next-line max-len
      regex: /GitHub|Stack Overflow|BitBucket|Gitlab|vim|Spyder|kate|Ghidra|Scite/gi,
    },
  },
  {
    name: ["Work", "Programming", "ActivityWatch"],
    rule: {type: "regex", regex: /ActivityWatch|aw-/gi, ignore_case: true},
  },
  {name: ["Work", "Image"], rule: {type: "regex", regex: /GIMP|Inkscape/gi}},
  {name: ["Work", "Video"], rule: {type: "regex", regex: /Kdenlive/gi}},
  {name: ["Work", "Audio"], rule: {type: "regex", regex: /Audacity/gi}},
  {name: ["Work", "3D"], rule: {type: "regex", regex: /Blender/gi}},
  {
    name: ["Media", "Games"],
    rule: {type: "regex", regex: /Minecraft|RimWorld/gi},
  },
  {
    name: ["Media", "Video"],
    rule: {type: "regex", regex: /YouTube|Plex|VLC/gi},
  },
  {
    name: ["Media", "Social Media"],
    rule: {
      type: "regex",
      regex: /reddit|Facebook|Twitter|Instagram|devRant/gi,
      ignore_case: true,
    },
  },
  {
    name: ["Media", "Music"],
    rule: {
      type: "regex",
      regex: /Spotify|Deezer/gi,
      ignore_case: true,
    },
  },
  {
    name: ["Comms"],
    rule: {
      type: "regex",
      regex: /Slack|Riot|Element|Discord|Nheko|NeoChat|Mattermost/gi,
    },
  },
  {
    name: ["Comms", "IM"],
    rule: {
      type: "regex",
      // eslint-disable-next-line max-len
      regex: /Messenger|Telegram|Signal|WhatsApp|Rambox|Slack|Riot|Element|Discord|Nheko|NeoChat|Mattermost/gi,
    },
  },
  // eslint-disable-next-line max-len
  {name: ["Comms", "Email"], rule: {type: "regex", regex: /Gmail|Thunderbird|mutt|alpine/gi}},
];
