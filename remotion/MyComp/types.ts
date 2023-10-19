export type GitHubResponse = {
  data: {
    user: {
      contributionsCollection: {
        contributionCalendar: {
          weeks: Week[];
        };
      };
    };
  };
};

type Week = {
  contributionDays: ContributionDay[];
};

type ContributionDay = {
  contributionCount: number;
  date: string;
};
