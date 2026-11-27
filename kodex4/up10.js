(function(){
"use strict";
function strip(){
  var s = document.getElementById("toolstrip");
  if (!s){ s = document.createElement("div"); s.id = "toolstrip"; var f = document.getElementById("composer"); f.parentNode.insertBefore(s, f); }
  return s;
}
function panel(title, btn){
  var p = document.createElement("div");
  p.className = "toolpanel hidden";
  var h = document.createElement("div"); h.className = "tphead";
  var t = document.createElement("div"); t.className = "tlabel"; t.textContent = title;
  var x = document.createElement("button"); x.className = "tpx"; x.textContent = "\u2715";
  x.addEventListener("click", function(){ p.classList.add("hidden"); btn.classList.remove("active"); });
  h.appendChild(t); h.appendChild(x); p.appendChild(h);
  document.body.appendChild(p);
  return p;
}
var API = [
["Player", "Character, UserId, Team; Kick(), LoadCharacter(); events CharacterAdded, Chatted"],
["Humanoid", "WalkSpeed, Health, MaxHealth; TakeDamage(), MoveTo(); events Died, StateChanged"],
["Instance", "Instance.new(class, parent), FindFirstChild(), WaitForChild(), Clone(), Destroy(), GetChildren(), IsA()"],
["Vector3 / CFrame", "Vector3.new(x,y,z), .Magnitude, .Unit; CFrame.new(pos), CFrame.lookAt(a,b), Lerp(), cf * offset"],
["TweenService", "TweenInfo.new(time, style, dir, repeats, reverses, delay); TS:Create(obj, info, goals), Play(), Completed"],
["DataStoreService", "GetDataStore(name), GetAsync/SetAsync/UpdateAsync(key), always pcall; UpdateAsync(key, function(old) return new end)"],
["RemoteEvent", "FireServer/FireAllClients/FireClient, OnServerEvent/OnClientEvent; never trust client args"],
["RunService", "Heartbeat/RenderStepped/Stepped, IsServer(), IsClient(), BindToRenderStep"],
["UserInputService", "InputBegan/InputEnded, input.KeyCode, IsKeyDown(), TouchEnabled, gameProcessed"],
["RaycastParams", "RaycastParams.new(), FilterType Exclude/Include, FilterDescendantsInstances, RespectCanCollide; workspace:Raycast()"],
["PathfindingService", "CreatePath{AgentRadius,AgentHeight,AgentCanJump}, ComputeAsync(a,b), .Status, GetWaypoints()"],
["SoundService", "Sound: SoundId, Volume, Looped, Play(); SoundService:PlayLocalSound()"],
["MarketplaceService", "ProcessReceipt callback (return PurchaseGranted), PromptProductPurchase, UserOwnsGamePassAsync"],
["HttpService", "JSONEncode/JSONDecode, GenerateGUID(), RequestAsync (enable in game settings)"],
["CollectionService", "AddTag/RemoveTag, GetTagged(tag), GetInstanceAddedSignal(tag)"],
["MemoryStoreService", "GetSortedMap(name), Get/Set/UpdateAsync with expiration, cross-server queues"],
["TeleportService", "TeleportAsync(placeId, players, options), TeleportInitFailed"],
["Teams", "Team instances, player.Team, TeamColor, auto-assignable"]
];
var btn = document.createElement("button");
btn.className = "toolbtn"; btn.textContent = "api"; btn.title = "Roblox API quick reference";
var p = panel("roblox api reference", btn);
var search = document.createElement("input");
search.className = "tinput"; search.placeholder = "filter classes...";
p.appendChild(search);
var list = document.createElement("div");
p.appendChild(list);
function paint(){
  var q = search.value.toLowerCase();
  list.innerHTML = "";
  API.forEach(function(a){
    if (q && (a[0] + " " + a[1]).toLowerCase().indexOf(q) === -1) return;
    var b = document.createElement("button");
    b.className = "dbg";
    var n = document.createElement("b"); n.textContent = a[0];
    var d = document.createElement("span"); d.className = "cause"; d.textContent = a[1];
    b.appendChild(n); b.appendChild(d);
    b.addEventListener("click", function(){
      KODEX.inputEl.value = "Show me a full roblox luau example using " + a[0] + ". Cover: " + a[1];
      KODEX.inputEl.focus();
      p.classList.add("hidden"); btn.classList.remove("active");
    });
    list.appendChild(b);
  });
}
search.addEventListener("input", paint);
paint();
btn.addEventListener("click", function(){
  var open = !p.classList.contains("hidden");
  document.querySelectorAll(".toolpanel").forEach(function(z){ z.classList.add("hidden"); });
  document.querySelectorAll(".toolbtn").forEach(function(z){ z.classList.remove("active"); });
  if (!open){ p.classList.remove("hidden"); btn.classList.add("active"); search.focus(); }
});
strip().appendChild(btn);
})();
