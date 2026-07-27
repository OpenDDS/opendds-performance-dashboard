import * as cdk from 'aws-cdk-lib';

export interface ControlPlaneConfig {
  readonly openDdsRepoUrl: string;
  readonly nightlyRepoUrl: string;
  readonly dashboardRepoUrl: string;
  readonly dashboardRef: string;
  readonly openDdsOidcSubject: string;
  readonly dashboardOidcSubject: string;
  readonly budgetUsd: number;
  readonly budgetEmail?: string;
}

const defaults: ControlPlaneConfig = {
  openDdsRepoUrl: 'https://github.com/OpenDDS/OpenDDS.git',
  nightlyRepoUrl: 'https://github.com/OpenDDS/nightly.git',
  dashboardRepoUrl: 'https://github.com/OpenDDS/opendds-performance-dashboard.git',
  dashboardRef: 'master',
  openDdsOidcSubject: 'repo:OpenDDS/OpenDDS:*',
  dashboardOidcSubject: 'repo:OpenDDS/opendds-performance-dashboard:ref:refs/heads/master',
  budgetUsd: 100,
};

function context(app: cdk.App, name: keyof ControlPlaneConfig): unknown {
  return app.node.tryGetContext(name) ?? defaults[name];
}

function validateRepositoryUrl(name: string, value: string): string {
  if (!/^https:\/\/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+(?:\.git)?$/.test(value)) {
    throw new Error(`${name} must be an HTTPS github.com repository URL`);
  }
  return value;
}

function validateRef(value: string): string {
  if (!/^[A-Za-z0-9][A-Za-z0-9._/-]{0,127}$/.test(value) || value.includes('..')) {
    throw new Error('dashboardRef contains unsupported characters');
  }
  return value;
}

function validateSubject(name: string, value: string): string {
  if (!/^repo:[A-Za-z0-9_.@/-]+:(?:\*|ref:refs\/heads\/[A-Za-z0-9._/-]+)$/.test(value)) {
    throw new Error(`${name} is not a supported GitHub OIDC subject`);
  }
  return value;
}

export function loadControlPlaneConfig(app: cdk.App): ControlPlaneConfig {
  const budgetUsd = Number(context(app, 'budgetUsd'));
  if (!Number.isFinite(budgetUsd) || budgetUsd <= 0) {
    throw new Error('budgetUsd must be a positive number');
  }
  const budgetEmailValue = context(app, 'budgetEmail');
  const budgetEmail = budgetEmailValue === undefined || budgetEmailValue === ''
    ? undefined : String(budgetEmailValue);
  if (budgetEmail && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(budgetEmail)) {
    throw new Error('budgetEmail must be a valid email address');
  }
  return {
    openDdsRepoUrl: validateRepositoryUrl('openDdsRepoUrl', String(context(app, 'openDdsRepoUrl'))),
    nightlyRepoUrl: validateRepositoryUrl('nightlyRepoUrl', String(context(app, 'nightlyRepoUrl'))),
    dashboardRepoUrl: validateRepositoryUrl('dashboardRepoUrl', String(context(app, 'dashboardRepoUrl'))),
    dashboardRef: validateRef(String(context(app, 'dashboardRef'))),
    openDdsOidcSubject: validateSubject('openDdsOidcSubject', String(context(app, 'openDdsOidcSubject'))),
    dashboardOidcSubject: validateSubject('dashboardOidcSubject', String(context(app, 'dashboardOidcSubject'))),
    budgetUsd,
    budgetEmail,
  };
}
