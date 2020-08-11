//* Adding new lines for translation should follow the same pattern:
//* {component_name}__{description}
//* separate component name from description with double under and words separated with under
//* separate by folders and a comment indicating the folder name.

export const en = {
  // ** Components ** //
  bar_chart__by_gender: 'By Gender',
  bar_chart__by_age_range: 'By Age Range',
  bar_chart__by_ethnicity: 'By Ethnicity',

  camera_config__center_camera_space: "Center's Cameras & Spaces",
  camera_config__center_camera_tab_btn: 'Cameras',
  camera_config__center_spaces_tab_btn: 'Spaces',

  center_config__center_info: 'Center Information',
  center_config__center_name: 'Name',
  center_config__center_address: 'Address',
  center_config__register_btn: 'Register center',
  center_config__manager_name: "Manager's Name",
  center_config__manager_email: "Manager's Email",
  center_config__add_manager_btn: 'Invite Manager',

  employee_card__desk_tag: 'Desk: {zone}',
  employee_card__status_tag: 'Status: {status}',

  space_config__title: 'Select Areas',
  space_config__select_area_label: 'Area Type',

  user_form__profile_title: 'Profile',
  user_form__office_label: 'Office',
  user_form__desk_label: 'Desk',
  user_form__working_hours_label: 'Expected Working Hours',
  user_form__status_label: 'Status',
  user_form__personalize_title: 'Personalize',
  user_form__language_label: 'Language',

  // ** Layout ** //
  header__general_view_title: 'General View',

  // ** Pages ** //
  camera_config_dashboard__title: 'Centers Configuration: {center}',

  center_dashboard__hx_meter: 'Happiness Experience Meter',
  center_dashboard__customer_attendance: 'Customer Attendance',
  center_dashboard__customer: 'customers',
  center_dashboard__avg_waiting_time: 'Average Waiting Time',
  center_dashboard__data_for_center_name: 'Customers currently in {center}',
  center_dashboard_notification_title: 'Notifications',
  center_dashboard__active_employees: 'Active employees: {amount}',

  officer_dashboard__customer_list: "Customer's List",
  officer_dashboard__general_info: 'General Center Information',
  officer_dashboard__current_ppl_count: 'Current people count',
  officer_dashboard__individuals: 'Individuals',
  officer_dashboard__avg_waiting_time: 'Average waiting time',
  officer_dashboard__percent_ppl_waiting: 'Percent of people waiting',
  officer_dashboard__active_officers: 'Active officers on site',
  officer_dashboard__new_alert: 'New Alert',
  officer_dashboard__last_update: 'Last update on {time}',
  officer_dashboard__hx_graph: 'Happiness Experience Graph',
  officer_dashboard__journey_stages: 'Journey Stages',
  officer_dashboard__footage: 'Footage',
  officer_dashboard__no_clients: 'Waiting for clients!',

  // common
  see_details: 'See details',
  calendar_filter_title: 'Select a specific period of time',
  calendar_filter_apply_btn_text: 'Apply filters',

  // home dashboard
  home_dashboard__title: '{center} Conclusions ',
  officer_home_dashboard__title: '{center} | Real time metrics ',
  officer_home_summary__title: 'Live Summary',
  home_dashboard__hx_indicator_title: 'About this indicator',
  home_dashboard__hx_indicator_description:
    'The Happiness experience indicator, reveals the average happiness of customers and visitors in the center comparing satisfaction, time in center and facial recognition.',
  home_dashboard__hx_indicator_good: 'GOOD SCORE',
  home_dashboard__hx_indicator_medium: 'MEDIUM SCORE',
  home_dashboard__hx_indicator_bad: 'BAD SCORE',
  home_dashboard__journey_summary_title: 'Journey Summary',
  home_dashboard__journey_line_chart_title:
    'Happiness Experience during time in center',
  home_dashboard__journey_overall_summary: 'Overall Summary during experience',
  home_dashboard__journey_overall_summary_assistance: 'Needs assistance',
  home_dashboard__journey_overall_summary_device: 'Use devices',
  home_dashboard__journey_overall_summary_ai: 'Interact with AI',
  home_dashboard__journey_overall_summary_bills: 'Pay bills',
  home_dashboard__not_enough_data: 'Not enough data to show yet.',

  happiness_experience: 'Happiness Experience',
  wating_time: 'Waiting Time',
  customers_and_visitors: 'Customers & Visitors',
  journey_summary: 'Journey Summary',
  alerts_and_recomendations: 'Alerts & Recommendations',

  // hx dashboard
  hx_dashboard_title: 'Happiness Experience',
  hx_dashabord__summary_title: 'Overall Summary',
  hx_dashboard__summary_chart_title: 'Aggregated HX during the day',
  hx_dashboard__common_journey_title: 'Most common  Journeys of our Customers',
  hx_dashboard__hx_area_title: 'Happiness Experience by area',
  hx_dashboard__hx_area_descrption: 'Select to highlight an area',

  // customer dashboard
  customer_dashboard_title: 'Customers',
  customer_dashboard__insight_title: 'Insights related with Customers',
  customer_dashboard__insight_details_title: 'Customer details:',
  customer_dashboard__insight_hx_area_title: 'People counting by area',
  customer_dashboard__insight_list_of_customers_title:
    'List of Customers & Visitors',
  customer_dashboard__insight_list_of_customers_description:
    'See all the details of your cutomers & visitors in the center.',
  customer_dashboard__insight_customer_map_title: 'Current Customers in Center',
  customer_dashboard__insight_heatmap_map_title:
    '2D Map of customer density in center',
  customer_dashboard__list_of_customers_title: 'List of Customers',

  // detailed customer
  deatiled_customer_dashboard_title: 'Detailed Customer Activity in center',
  deatiled_customer_dashboard__customer_journey_title: 'Customer Journey',
  deatiled_customer_dashboard__status_time_in_center: 'Time in center:',
  deatiled_customer_dashboard__status_emotion: 'Emotion:',
  deatiled_customer_dashboard__status_mask: 'Wearing Mask:',
  deatiled_customer_dashboard__status_aggregated_hx: 'Aggregate HX:',

  // waiting time dashboard
  waitingTime_dashboard_title: 'Waiting Time',
  waitingTime_dashboard__content_title: 'Waiting time',
  waitingTime_dashboard__content_overall: 'Overall waiting time in center',
  waitingTime_dashboard__content_overall_average: 'Avg. Waiting Time',
  waitingTime_dashboard__content_overall_total: 'Total people waiting',
  waitingTime_dashboard__content_peopleByArea: 'People waiting by area',
  waitingTime_dashboard__people_waiting: 'Demographics of people waiting:',
  // journey dashboard
  journey_dashboard_title: 'Customer & Visitor Journey',
  journey_dashboard__relevant_indicators_title:
    'Relevant indicators about our Customers & Visitors interaction',
  journey_dashboard__relevant_indicators_entrance_title: 'Entrance',
  journey_dashboard__relevant_indicators_entrance_main_entrance_text:
    'Main Entrance',
  journey_dashboard__relevant_indicators_entrance_secondary_entrance_text:
    'Secondary Entrance',
  journey_dashboard__relevant_indicators_beam_text: 'Use BEAM',
  journey_dashboard__relevant_indicators_devices_text: 'Use Devices',
  journey_dashboard__relevant_indicators_support_text: 'Need Support',
  journey_dashboard__relevant_indicators_top_devices_text:
    'Top devices “in-use”',
  journey_dashboard__top_journeys_title: 'Top  Customer Journeys ',

  // employee dashbaord
  employee_dashboard_title: '{center} Employees',
  employee_dashboard__add_btn_text: 'Add New Employee',
  employee_dashboard__list_of_employees_title: 'List of employees',
  employee_dashboard__employee_edit_title: 'My Profile',

  // settings dashbaord
  settings_dashboard_title: 'Settings',
  settings_dashboard__logout_btn_text: 'Log out',
  settings_dashboard__profile_title: 'My profile',
  settings_dashboard__profile_inputs_title: 'Edit profile',
  settings_dashboard__center_title: 'My center',
  settings_dashboard__center_inputs_title: 'Edit Center Details',
};
