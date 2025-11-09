export interface Topic {
  name: string;
}

export interface TopicCategory {
  category: string;
  topics: Topic[];
}