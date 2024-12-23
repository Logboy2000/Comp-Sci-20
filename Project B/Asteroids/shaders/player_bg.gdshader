shader_type canvas_item;
render_mode blend_add;

uniform vec2 playerPos = vec2(100,100);
uniform vec2 playerFollow = vec2(100,100);
uniform vec4 playerColor = vec4(1);
uniform float playerTime = 0.0;

//global uniform float GAME_TIME = 0.0;


//float pinch(float v){
	//if(v < 0.5){
	    //return -v*v;
	//} else {
	    //return v*v;
	//}
//}
//float torCurve(float x, float a, float b, float c){
	//c = pinch(c);
	//x = max(0.0, min(1.0, x)); //clamp input to [0-1], behavior is undefined otherwise
	//float s = exp(a); //could be any exponential like 2^a or 3^a, or just linear
	//float s2 = 1.0/s;
	//float t = max(0.0, min(1.0, b));
	//float u = c; //should normally be clamped but creates possibly useful results outside of the 0-1 range
	//float eps = 0.00001; //protect against div/0
	//
	//float result = 0.0;
	//float c1 = 0.0; //normal 1/x
	//float c2 = 0.0; //flat-center
	//float c3 = 0.0; //flat-end
	//if(x < t){
		//c1 = (t*x)/(x+s*(t-x)+eps);
		//c2 = t-pow(1.0/(t+eps), s2-1.0)*pow(abs(x-t), s2);
		//c3 = pow(1.0/(t+eps), s-1.0)*pow(x,s);
	//} else {
		//c1 = (1.0-t)*(x-1.0)/(1.0-x-s*(t-x)+eps)+1.0;
		//c2 = pow(1.0/((1.0-t)+eps), s2-1.0)*pow(abs(x-t), s2)+t;
		//c3 = 1.0-pow(1.0/((1.0-t)+eps), s-1.0)*pow(1.0-x,s);
	//}
	//if(u <= 0.0){
		//result = (-u) * c2 + (1.0 + u) * c1;
	//} else {
		//result = (u) * c3 + (1.0 - u) * c1;
	//}
	//return result;
//}


vec4 mod289_4(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 perm(vec4 x){return mod289_4(((x * 34.0) + 1.0) * x);}

float noise(vec3 p){
    vec3 a = floor(p);
    vec3 d = p - a;
    d = d * d * (3.0 - 2.0 * d);

    vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
    vec4 k1 = perm(b.xyxy);
    vec4 k2 = perm(k1.xyxy + b.zzww);

    vec4 c = k2 + a.zzzz;
    vec4 k3 = perm(c);
    vec4 k4 = perm(c + 1.0);

    vec4 o1 = fract(k3 * (1.0 / 41.0));
    vec4 o2 = fract(k4 * (1.0 / 41.0));

    vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
    vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

    return o4.y * d.y + o4.x * (1.0 - d.y);
}


void fragment() {
	vec2 res = vec2(400,400);
	vec2 px = UV*res;

	vec3 col = vec3(0.2);

	float hn = pow(noise(vec3((px+playerPos)/80.0, playerTime/1000.0 + 6.0)),3.0);
	//float hn = pow(iqnoise((px+windowPos)/30.0, 1.0, 1.0) ,0.66);
	float pfd = distance(px, 1.0*playerFollow + res/2.0);
	float pd = distance(px, res/2.0);

	float md = pfd * (pd-60.0);
	md = 1.0 - (md/4000.0);
	md = clamp(md, 0.0, 1.0);
	md = pow(md, 2.0);

	//float md2 = pfd * (pd-60.0);
	//md2 = 1.0 - (md2/4000.0);
	//md2 = clamp(md2, 0.0, 1.0);
	////md2 = pow(md2, 2.0);

	pfd = (pfd/80.0);
	pfd = clamp(1.0-pfd, 0.0, 1.0);
	pd = (pd/200.0);
	float pdRaw = pd;
	//pd = torCurve(pd, 0.75, 0.2, 1.0);
	//pd = pow(pd, 0.7);
	//pd = smoothstep(0.0, 1.0, pow(pd,0.7));
	float pde = smoothstep(0.0,1.0, 1.0 - pow(1.0 - 0.9*pd, 1.5));
	pd = pow(pde,1.25);
	//pd = 1.0 - (1.0-pd)*torCurve(pdRaw, 1, 0.2, 1.0);
	pd = 1.0 - (1.0-pd)*pd;
	pd += pow(pd, 2.0)*(4.0*hn) * md;
	//pd -= torCurve(pd, 1, 0.8, 1.0)*(1.0*hn) * md;
	pd = clamp(pd, 0.0, 1.0);
	pd = 1.0 - (1.0 - pd)/0.7;

	vec4 highlight;
	if(playerColor.x < 0.0){
		highlight = mix(vec4(0.3 + 0.7*pow(pd, 4.0), 0.2, 1, 0.65), vec4(0.6, 0.303, 1, 0), pow(pd, 4.0));
	} else {
		highlight = mix(playerColor, playerColor+vec4(0.9*pow(pd, 8.0), -0.3, 0.9, 0.0), pow(pd, 6.0));
	}
	//highlight = clamp(highlight, 0.0, 1.0);
	//vec4 highlight = playerColor;
	float ha = mix(0.6, 0, pow(pd, 1.7));
	//highlight *= 1.0 - hn;
	COLOR.rgb += 0.85*highlight.rgb;
	COLOR.a = 1.1*ha;
	//COLOR.rgb += 0.85*highlight.rgb*(1.0-md2);
	//COLOR.a = md2+2.0*ha;
	//if(pdRaw < 0.6){
		//COLOR.rgb = mix(COLOR.rgb, vec3(0.0), 1.0-0.0*(1.0-md2));
		//COLOR.a += md2;
	//}


}
