import { createSelector } from 'reselect';
import _ from 'lodash';

const OrganizationSelector = state => state.data.organizations;
const idSelector = state => state.ui.organization;

const selectedOrganizationSelector = createSelector(
  idSelector,
  OrganizationSelector,
  (id, organizations) => {
    const organizationKey = organizations &&
    _.keys(organizations)
    .find(organization => organizations[organization].id === id.selectedOrganization);
    return organizationKey && organizations[organizationKey];
  }
);

export default selectedOrganizationSelector;
