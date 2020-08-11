//***********************************
//** DEWA Data Types and Endpoints **
//***********************************

/**
 * * Request's Additional Headers:
 *  @param start_date
 *  @param end_date
 *  @param Authorization_Token
 */

/**
 * authenticate: [POST]
 * @param {string} username: //email
 * @param {string} password: hashed password
 * @returns  {User}
 */
interface User {
  token: string;
  employee: Employee;
}

//** For General management:
/** Request all centers info: Only available for General Management
 * get_all_centers_info [GET]
 * @returns {GetAllCentersResponse}
 */
type GetAllCentersResponse = Center[];

/** Requests the list of highlights of the selected date range for general management.
 * get_highlights [GET]
 * @returns {GetHighlightsResponse}
 */
type GetHighlightsResponse = Highlight[];

//** For Center Management and Officers:
/** Request the correspondent center of the employee making the request
 * get_center_info [GET]
 * @returns {Center}
 */

//** General use:
/** Request time frames of data for a specific category
 * if
 * get_timeline [GET]
 * @param {CategoryEnum} category
 * @param {GroupEnum} group
 * @param {string} center_name: general management can ask for 'ALL' centers
 * @returns {GetTimelineResponse}
 */
type GetTimelineResponse = [
  {
    timestamp: number;
    columns: string[];
    values: number[];
  },
];

/**
 * Create a new user employee
 * create_user [POST]
 * @param {Employee} user to be added
 * @returns {Employee} new user
 */

/**
 * Update the user profile values
 * update_user [PUT]
 * @param {string} id: username or email
 * @param {Employee} newValues: values to be updated on the user
 * @returns {Employee} the employee with the new values
 */

/**
 * Notifications
 *  ! Review functionality.
 *  ! Its meant to work by constantly asking the back if there are new notifications.
 * get_notifications:
 * @returns {Notification[]}
 */
interface Notification {}

//** DEWA data types

//** String literals
type HighlightType = 'HIGH' | 'LOW';
type Category = 'HX' | 'ATTENDANCE' | 'WAITING_TIME';
type Group = 'NONE' | 'GENDER' | 'AGE' | 'ETHNICITY';
type RoleType = 'GENERAL_MANAGEMENT' | 'CENTER_MANAGEMENT' | 'OFFICER';
type AgeRange = '0-18' | '19-49' | '50+';
type LocaleString = 'es' | 'en'; // | ...
type WorkingHoursType = 'FULLTIME'; // | ...
type AlertType = 'WAITING_TIME_EXCEEDED' | 'AVG_WAITING_TIME_INCREASING'; // | ...
type Gender = 'MALE' | 'FEMALE' | 'UNKNOWN';
type time_frame = { timestamp: number; value: number | string };

//** Classes
interface Center {
  name: string;
  location: string;
  lat: number;
  lng: number;
  //aggregations
  avg_happiness_level: number;
  total_ppl_entries: number;
  current_ppl_count: number;
  total_male: number;
  total_female: number;
  total_low_age: number;
  total_mid_age: number;
  total_high_age: number;
  total_local: number;
  total_non_local: number;
  avg_waiting_time: number;
  percent_ppl_waiting: number;
  //subcollections
  employee_list: Employee[];
  customer_list: Customer[];
  alerts: Alerts[];
}

interface Highlight {
  type: HighlightType;
  data_type: Category;
  center_name: string;
  data_center_names: string[];
  data_center_values: number[];
}

interface Customer {
  id: string;
  center_name: string;
  gender: Gender;
  age_range: AgeRange;
  is_local: boolean;
  //aggregations
  avg_waiting: number;
  avg_happiness_level: number;
  //timelines - possibility of adding this to another endpoint to reduce payload size
  happiness_timeline: time_frame[];
  zone_timeline: time_frame[];
}

interface Zone {
  center_name: string;
  name: string;
  assigned_employee_id: number;
}

interface Employee {
  email: string;
  photo: string;
  name: string;
  job_title: string;
  center_name: string;
  designated_zone_name: string;
  working_hours: WorkingHoursType;
  is_active: boolean;
  language: LocaleString;
  // ! Only to store in the db. Should not be added to the response.
  hashed_pass: string;
}

interface Alerts {
  center_name: string;
  alert_type: AlertType;
  viewable_level: RoleType;
  assigned_employee_id?: number;
  duration?: number;
}
