var define = require('node-constants')(exports);

define({
	API_PREFIX: '/api',
	ALL_VERIFICATIONS: '/verifications',
	ASSET_VERIFICATION: '/asset/:epc_identifier/validation',
	CI_TYPE_REST_ENDPOINT: 'REST',
	ENTITY_TYPE_MANUFACTURER: 'MANUFACTURER',
	ENTITY_TYPE_VRS_PROVIDER: 'VRS_PROVIDER',
	VERIFY_PRODUCT: '/productIdentifier',
	REQUESTING: 'Requesting',
	VERIFIED: 'VERIFIED',
	NOT_VERIFIED: 'NOT_VERIFIED',
	PENDING: 'PENDING',
	GET_VERIFICATION_BY_SRN: '/verification/:gtin/:srn',
	ERROR: 'ERROR',
	REQUEST_RECEIVED: 'REQUEST_RECEIVED',
	REQUESTOR_VALIDATION: 'REQUESTOR_VALIDATION',
	PARSING_REQUEST: 'PARSING_REQUEST',
	VALID_REQUEST: 'VALID_REQUEST',
	LOOKUP_CONTACTED: 'LOOKUP_CONTACTED',
	POSTED_TO_RESPONDER: 'POSTED_TO_RESPONDER',
	FORWARDED_TO_OTHER_VRS: 'FORWARDED_TO_OTHER_VRS',
	RESPONSE_RECEIVED: 'RESPONSE_RECEIVED',
	RESPONSE_DELIVERED: 'RESPONSE_DELIVERED',
	LOOKUP_FOUND: 'LOOKUP_FOUND',
	LOOKUP_NOT_FOUND: 'LOOKUP_NOT_FOUND',
	REQUESTOR: 'Requestor',
	RESPONDER: 'Responder',
	REQUESTOR_UNKNOWN: 'Requestor unknown',
	TRUE: 'TRUE',
	FALSE: 'FALSE',
	INVALID_REQ_MSG: `The request was not formatted properly. 
		Please verify the request conforms to this specification, 
		and re-issue the request in the correct format.`,
	LOOKUP_NOTFOUND_MSG: `Responders Repository Connectivity Information Not Found. 
		Contact the Manufacturer / Product GTIN Owner.`,
	VRS_PROVIDER: 'VRS Provider',
	FORWARDED_TO_MANUFACTURER: 'FORWARDED_TO_MANUFACTURER',
	LD: 'Lookup Directory',
	OTHER_VRS: 'Other VRS',
	ADD: 'add',
	DELETE: 'delete',
	PRODUCT_NOT_VERIFIED: 'PRODUCT_NOT_VERIFIED',
	USERS: {
		'eb7a581f-f06c-4290-a805-64e10cb314b4' : 'Jim Thomson',
		'f1e710ab-c3eb-4b0d-8617-844af593e8dc': 'Shankar Sharma',
		'98d76118-8c68-4dd7-835e-5b0e82b00a0e': 'Kattie Ryan'
	}
});

