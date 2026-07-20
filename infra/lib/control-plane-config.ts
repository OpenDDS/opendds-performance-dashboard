import * as cdk from 'aws-cdk-lib';

export interface ControlPlaneConfig {
  readonly openDdsRepoUrl: string;
  readonly nightlyRepoUrl: string;
  readonly dashboardRepoUrl: string;
  readonly dashboardRef: string;
  readonly openDdsOidcSubject: string;
  readonly dashboardOidcSubject: string;
}

const defaults: ControlPlaneConfig = {
  openDdsRepoUrl: 'https://github.com/OpenDDS/OpenDDS.git',
  nightlyRepoUrl: 'https://github.com/OpenDDS/nightly.git',
  dashboardRepoUrl: 'https://github.com/OpenDDS/opendds-performance-dashboard.git',
  dashboardRef: 'master',
  openDdsOidcSubject: 'repo:OpenDDS/OpenDDS:*',
  dashboardOidcSubject: 'repo:OpenDDS/opendds-performance-dashboard:ref:refs/heads/master',
};

function context(app: cdk.App, name: keyof ControlPlaneConfig): string {
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
  return {
    openDdsRepoUrl: validateRepositoryUrl('openDdsRepoUrl', context(app, 'openDdsRepoUrl')),
    nightlyRepoUrl: validateRepositoryUrl('nightlyRepoUrl', context(app, 'nightlyRepoUrl')),
    dashboardRepoUrl: validateRepositoryUrl('dashboardRepoUrl', context(app, 'dashboardRepoUrl')),
    dashboardRef: validateRef(context(app, 'dashboardRef')),
    openDdsOidcSubject: validateSubject('openDdsOidcSubject', context(app, 'openDdsOidcSubject')),
    dashboardOidcSubject: validateSubject('dashboardOidcSubject', context(app, 'dashboardOidcSubject')),
  };
}
