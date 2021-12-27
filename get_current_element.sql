CREATE OR REPLACE FUNCTION select_current_game_element()
RETURNS TABLE (
"id" int8,
"createdAt" timestamptz,
"textOfDay" text,
"completed"	bool,
"approved" bool,
"timeApproved" timestamp,
"hint" text,
"answer" text,
"currentCount" int2,
"maxCount" int2,
"timeDependentTime" text,
"gyro" bool
)
LANGUAGE plpgsql AS
$func$
BEGIN
   RETURN QUERY
   SELECT * FROM public."GameElements" ge WHERE ge."timeApproved" >= NOW() - INTERVAL '10 MINS' OR ge."timeApproved" is NULL ORDER BY "id" asc LIMIT 1;
END
$func$;
