import { arrayOf, Schema } from 'normalizr';

const organizationSchema = new Schema('organizations');
const purposeSchema = new Schema('purposes');
const reservationSchema = new Schema('reservations', { idAttribute: 'url' });
const resourceSchema = new Schema('resources');
const unitSchema = new Schema('units');

resourceSchema.define({
  unit: unitSchema,
});

const paginatedOrganizationsSchema = new Schema('paginatedOrganizations');
const paginatedPurposesSchema = new Schema('paginatedPurposes');
const paginatedReservationsSchema = new Schema('paginatedReservations');
const paginatedResourcesSchema = new Schema('paginatedResources');
const paginatedUnitsSchema = new Schema('paginatedUnits');

paginatedOrganizationsSchema.define({
  results: arrayOf(organizationSchema),
});

paginatedPurposesSchema.define({
  results: arrayOf(purposeSchema),
});

paginatedReservationsSchema.define({
  results: arrayOf(reservationSchema),
});

paginatedResourcesSchema.define({
  results: arrayOf(resourceSchema),
});

paginatedUnitsSchema.define({
  results: arrayOf(unitSchema),
});

export default {
  paginatedOrganizationsSchema,
  paginatedPurposesSchema,
  paginatedReservationsSchema,
  paginatedResourcesSchema,
  paginatedUnitsSchema,
  organizationSchema,
  purposeSchema,
  resourceSchema,
  unitSchema,
};
